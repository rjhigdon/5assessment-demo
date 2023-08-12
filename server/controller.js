require ('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING)
//this is how you set up the db
module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS weapons;
            DROP TABLE IF EXISTS fighters;

            CREATE TABLE fighters(
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                power INT NOT NULL,
                hp INT NOT NULL,
                type VARCHAR NOT NULL
            );

           CREATE TABLE weapons (
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            power INT,
            owner INT REFERENCES fighters(id)
           );
        `)
        .then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('you had a Sequelize error in your seed function:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    createFighter: (req, res) => {
        const {name, power, hp, type} = req.body
        sequelize.query(`
        INSERT INTO fighters(name, power, hp, type)
        VALUES('${name}', '${power}', '${hp}', '${type}')
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
    },
    getFightersList: (req, res) => {
        sequelize.query(`
        SELECT id, name FROM fighters;
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
    },
    createWeapon: (req,res) => {
        const {name, power, owner} = req.body
        sequelize.query(`
        INSERT INTO weapons(name, power, owner)
        VALUES('${name}', '${power}', '${owner}')
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
    },
    getFightersWeapons: (req, res) => {
        sequelize.query(`
        SELECT f.id AS fighter_id, f.name AS fighter, f.power AS fighter_power, f.hp, f.type, w.id AS weapon_id, w.name AS weapon, w.power AS weapon_power FROM fighters f
            JOIN weapons w
            ON w.owner = f.id
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
    },
    deleteWeapon: (req, res) => {
        const {id} = req.params
        sequelize.query(`
        DELETE FROM weapons 
        WHERE id = ${id}
        `)
        .then((dbRes) => res.status(200).send(dbRes[0]))
    }
}