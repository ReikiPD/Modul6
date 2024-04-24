const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    ssl: {
        require: true,
    },
});

async function addEvent(req, res) {
    const { title, description, year, period, month, day, country, city } =
        req.body;

    try {
        const result = await pool.query(
            "INSERT INTO Modul6 (title, description, year, period, month, day, country, city) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [title, description, year, period, month, day, country, city]
        );
        const newEvent = result.rows[0];
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getAllEvents(req, res) {
    try {
        const result = await pool.query(
            'SELECT * FROM Modul6'
        );
        const getEvents = result.rows;
        res.status(200).json(getEvents);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateEvent(req, res) {
    const { id, title, description, year, period, month, day, country, city } = req.body;

    try {
        const result = await pool.query(
            'UPDATE Modul6 SET title = $2, description = $3, year = $4, period = $5, month = $6, day = $7, country = $8, city = $9 WHERE id = $1 RETURNING *',
            [id, title, description, year, period, month, day, country, city]
        );
        const updatingEvent = result.rows[0];
        res.status(200).json(updatingEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteEvent(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM Modul6 WHERE id = $1 RETURNING *',
            [id]
        );
        const deletingEvent = result.rows[0];
        res.status(200).json(deletingEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function addRecord(req, res) {
    const { title, description, year, period, month, day, country, city } = req.body;

    try {
        let check = title.length + description.length + year.length + period.length + month.length + day.length + country.length + city.length;
        if (check % 8 != 0) {
            res.status(500).json({ error: "Array length is incorrect!" });
        } else {
            for (let i = 0; i < title.length; i++) {
                await pool.query(
                    'INSERT INTO Modul6 (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                    [title[i], description[i], year[i], period[i], month[i], day[i], country[i], city[i]]
                );
            }
            res.status(201).json(req.body);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errors" });
    }
}

async function getCountry(req, res) {
    const { country } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM Modul6 WHERE country = $1', [country]
        );

        const event = result;
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errors" });
    }
}

async function getPaginate(req, res) {
    const { pageSize, page } = req.body;

    try {
        let pageS = page * pageSize;
        if(pageS == 0) {
            res.status(500).json({ error: "Page 0 does not exist! Start from page 1" });
        } else {
            pageS = pageS - pageSize;
            const result = await pool.query(
                'SELECT * FROM Modul6 LIMIT $1 OFFSET $2', [pageSize, pageS]
            );
    
            const paginate = result;
            res.status(201).json(paginate);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errors" });
    }
}

module.exports = {
    addEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    addRecord,
    getCountry,
    getPaginate
};

pool.connect().then(() => {
    console.log("Connected to database");
})