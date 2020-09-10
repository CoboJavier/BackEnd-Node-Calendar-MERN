const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name')

    res.json({
        ok: true,
        eventos
    });

    /*
        res.json({
            ok: true,
            msg: 'Get eventos'
        })
    */
}

const crearEvento = async(req, res = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(500).json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no permitido'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualziado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })
        res.json({
            ok: true,
            eventoActualziado,
            msg: 'Evento actualizado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contactar con el admin'
        })
    }



}

//Eliminar Evento
const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no permitido'
            })
        }

        const eventoBorrado = await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok: true,
            eventoBorrado,
            msg: 'Evento borrado'
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con el admin'
        });
    }


    res.json({
        ok: true,
        msg: 'Eliminar eventos'
    })
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}