// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const { auth, admin } = require('../middleware/auth');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

// Middleware para processar JSON e URL-encoded apenas para rotas específicas
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Listar todos os eventos (acessível a todos)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name')
      .populate('participants.user', 'name email')
      .populate('comments.user', 'name')
      .populate('ratings.user', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar a pasta uploads se não existir
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Criar um novo evento (somente administradores)
router.post('/', [auth, admin], async (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    allowEmptyFiles: false,
    filter: ({ mimetype }) => {
      return mimetype && /image\/(jpeg|jpg|png)/i.test(mimetype);
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar o formulário:', err);
      if (err.httpCode === 413) {
        return res.status(413).json({ message: 'Arquivo muito grande. O limite é 5MB.' });
      }
      if (err.message.includes('invalid mimetype')) {
        return res.status(400).json({ message: 'Apenas imagens JPEG ou PNG são permitidas.' });
      }
      return res.status(500).json({ message: 'Erro ao processar o upload: ' + err.message });
    }

    try {
      console.log('Dados recebidos nos fields:', fields);
      console.log('Arquivos recebidos:', files);

      const title = fields.title?.[0];
      const date = fields.date?.[0];
      const location = fields.location?.[0];
      const category = fields.category?.[0];
      const description = fields.description?.[0];
      const eventType = fields.eventType?.[0];
      const price = fields.price?.[0];

      if (!title || !date || !location || !category || !description || !eventType) {
        return res.status(400).json({
          message:
            'Todos os campos obrigatórios devem ser preenchidos: title, date, location, category, description, eventType',
        });
      }

      if (eventType === 'Pago' && !price) {
        return res.status(400).json({ message: 'O preço é obrigatório para eventos pagos' });
      }

      let imagePath = null;
      if (files.image && files.image[0]) {
        const file = files.image[0];
        const newFileName = `${Date.now()}${path.extname(file.originalFilename)}`;
        const newFilePath = path.join(uploadDir, newFileName);

        fs.renameSync(file.filepath, newFilePath);
        imagePath = `/uploads/${newFileName}`;
      }

      const event = new Event({
        title,
        date: new Date(date),
        location,
        category,
        description,
        eventType,
        price: eventType === 'Pago' ? Number(price) : undefined,
        image: imagePath,
        createdBy: req.user.id,
      });

      const newEvent = await event.save();
      console.log('Evento salvo no MongoDB:', newEvent);
      res.status(201).json(newEvent);
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      res.status(500).json({ message: 'Erro ao criar evento: ' + err.message });
    }
  });
});

// Atualizar um evento (somente administradores)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem editar eventos.' });
    }

    const { title, date, location, category, description, eventType, price } = req.body;
    event.title = title || event.title;
    event.date = date ? new Date(date) : event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.description = description || event.description;
    event.eventType = eventType || event.eventType;
    event.price = eventType === 'Pago' ? price : undefined;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants.user', 'name email')
      .populate('comments.user', 'name')
      .populate('ratings.user', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar um evento (somente administradores)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json({ message: 'Evento deletado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inscrever-se em um evento (somente participantes autenticados)
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error(`Usuário não encontrado para o ID: ${req.user.id}`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log(`Usuário encontrado:`, user);

    const isRegistered = event.participants && event.participants.some(
      participant => participant.user.toString() === req.user.id
    );
    if (isRegistered) {
      return res.status(400).json({ message: `O usuário já está inscrito neste evento` });
    }

    const participant = {
      user: req.user.id,
      email: user.email ? user.email.trim() : undefined,
    };

    console.log(`Participante a ser adicionado:`, participant);

    if (!event.participants) {
      await Event.updateOne(
        { _id: req.params.id },
        { $set: { participants: [] } },
        { runValidators: true }
      );
    }

    const updateResult = await Event.updateOne(
      { _id: req.params.id },
      {
        $push: {
          participants: participant,
        },
      },
      { runValidators: true }
    );

    if (updateResult.modifiedCount === 0) {
      console.error('Nenhum documento foi modificado ao adicionar o participante');
      return res.status(500).json({ message: 'Falha ao adicionar o participante ao evento' });
    }

    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('comments.user', 'name')
      .populate('participants.user', 'name email');
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Erro ao inscrever-se no evento:', err);
    res.status(400).json({ message: err.message });
  }
});

// Cancelar inscrição em um evento (somente participantes autenticados)
router.post('/:id/unregister', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const participantIndex = event.participants
      ? event.participants.findIndex(participant => participant.user.toString() === req.user.id)
      : -1;
    if (participantIndex === -1) {
      return res.status(400).json({ message: 'Você não está inscrito neste evento' });
    }

    event.participants.splice(participantIndex, 1);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('comments.user', 'name')
      .populate('participants.user', 'name email');
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Erro ao cancelar inscrição:', err);
    res.status(400).json({ message: err.message });
  }
});

// Adicionar um comentário (somente participantes autenticados)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const existingComment = event.comments.find(
      comment => comment.user.toString() === req.user.id
    );
    if (existingComment) {
      return res.status(400).json({ message: 'Você já comentou neste evento' });
    }

    const text = req.body.text;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'O comentário não pode estar vazio' });
    }

    const comment = {
      user: req.user.id,
      text: text,
      date: new Date(), // Garantir que a data seja definida
    };

    event.comments.push(comment);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('comments.user', 'name')
      .populate('participants.user', 'name email');
    res.status(201).json(updatedEvent);
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err);
    res.status(400).json({ message: err.message });
  }
});

// Adicionar uma avaliação (somente participantes autenticados)
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const existingRating = event.ratings.find(
      rating => rating.user.toString() === req.user.id
    );
    if (existingRating) {
      return res.status(400).json({ message: 'Você já avaliou este evento' });
    }

    const score = Number(req.body.score);
    if (!score || isNaN(score) || score < 1 || score > 5) {
      return res.status(400).json({ message: 'A nota deve ser um número entre 1 e 5' });
    }

    const rating = {
      user: req.user.id,
      score: score,
    };

    event.ratings.push(rating);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('comments.user', 'name')
      .populate('participants.user', 'name email');
    res.status(201).json(updatedEvent);
  } catch (err) {
    console.error('Erro ao adicionar avaliação:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;