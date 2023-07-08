const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('usuarios/add');
});

router.post('/add', async (req, res) => {
    const { username, password, fullname} = req.body;
    const newLink = {
        username, 
        password, 
        fullname,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO users set ?', [newLink]);
    req.flash('success', 'Saved Successfully');
    res.redirect('/usuarios');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.user.id]);
    res.render('usuarios/list', { links });
});

router.get('/delete/:id', async (req, res) => {     
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'Removed Successfully');
    res.redirect('/usuarios');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(links);
    res.render('usuarios/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, fullname } = req.body; 
    const newLink = {
        username,
        password,
        fullname,
    };
    await pool.query('UPDATE users set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Updated Successfully');
    res.redirect('/usuarios');
});

module.exports = router;