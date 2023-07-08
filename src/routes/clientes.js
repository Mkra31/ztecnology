const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('clientes/add');
});

router.post('/add', async (req, res) => {
    const { name, phone, address} = req.body;
    const newLink = {
        name,
        phone,
        address,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO clientes set ?', [newLink]);
    req.flash('success', 'client Saved Successfully');
    res.redirect('/clientes');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM clientes WHERE user_id = ?', [req.user.id]);
    res.render('clientes/list', { links });
});

router.get('/delete/:id', async (req, res) => {     
    const { id } = req.params;
    await pool.query('DELETE FROM clientes WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/clientes');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    console.log(links);
    res.render('clientes/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body; 
    const newLink = {
        name,
        phone,
        address,
    };
    await pool.query('UPDATE clientes set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Client Updated Successfully');
    res.redirect('/clientes');
});

module.exports = router;