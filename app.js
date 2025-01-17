const express = require('express')
const app = express()
const fs = require('fs');
const PORT = 3000;

const routerScraping = require('./scraping')

// FUNCIONES DADAS EN EL README 

function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
      return JSON.parse(data)

    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

function guardarDatos(noticias) {
fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

// 

app.use('/scraping', routerScraping)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// AGREGAR UNA NOTICIAS

app.post("/noticias", (req, res) => {
    
    let noticias = leerDatos();
    const { titulo, imagen, descripcion, enlace } = req.body
    
    const noticia = {
      titulo: titulo,
      imagen: imagen,
      descripcion: descripcion,
      enlace: enlace,
    };

    noticias.push(noticia);
    guardarDatos(noticias)
    res.json(noticias)
});

// OBTENER TODAS LAS NOTICIAS

app.get('/noticias', (req, res) => {
    const noticias = leerDatos()
    res.json(noticias);
});

// BORRAR NOTICIA

app.delete('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let noticias = leerDatos();
    if (id >= 0 && id < noticias.length) {
      const noticiaEliminada = noticias.splice(id, 1);
      guardarDatos(noticias);
      res.json({ message: 'Noticia eliminada', noticia: noticiaEliminada });
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
});

// PUT

app.put('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let noticias = leerDatos();
    const { titulo, descripcion, enlace, imagen } = req.body;
    leerDatos();
    if (id >= 0 && id < noticias.length) {
      noticias[id] = { titulo, descripcion, enlace, imagen };
      guardarDatos(noticias);
      res.json(noticias[id]);
    } else {
      res.status(404).json({ error: 'Noticia no encontrada' });
    }
  });

// LLAMADA AL SERVIDOR

app.listen(PORT, () => {
    console.log(`El servidor esta ecuchando en el puerto http://localhost:${PORT}, http://localhost:3000/scraping`)
}
)






