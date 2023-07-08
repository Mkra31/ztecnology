const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('inventory/add');
});

router.post('/add', async (req, res) => {
    const { title, precio, description,almacen,vendidos,margenbruto} = req.body;
    const newLink = {
        title,
        precio,
        description,
        almacen,
        vendidos,
        margenbruto,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO inventario set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/inventory');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM inventario WHERE user_id = ?', [req.user.id]);
    res.render('inventory/list', { links });
});

router.get('/delete/:id', async (req, res) => {     
    const { id } = req.params;
    await pool.query('DELETE FROM inventario WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/inventory');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM inventario WHERE id = ?', [id]);
    console.log(links);
    res.render('inventory/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, precio, description,almacen,vendidos,margenbruto } = req.body; 
    const newLink = {
        title,
        precio,
        description,
        almacen,
        vendidos,
        margenbruto,
    };
    await pool.query('UPDATE inventario set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/inventory');
});

module.exports = router;