const mongoose = require('mongoose');
const config = require('../../config/config');

// Убирает DeprecationWarning mongoose 6 про strictQuery
mongoose.set('strictQuery', true);

const RECONNECT_DELAY = 5000;

class MongoDBConnection {
    static isConnected = false;
    static db;
    static listenersBound = false;
    static reconnectTimer = null;

    static getConnection(result) {
        if (this.isConnected) {
            return result(null, this.db);
        }
        return this.connect(result);
    }

    static connect(result) {
        this.bindListeners();

        // once: колбэк старта сервера должен сработать ровно один раз
        mongoose.connection.once('open', () => {
            console.log('MongoDB connection opened!');
            this.db = mongoose;
            this.isConnected = true;
            return result(null, this.db);
        });

        this.openConnection();
    }

    static openConnection() {
        mongoose.connect(config.db.dbUrl, {dbName: config.db.dbName})
            .catch((error) => {
                // Без catch промах подключения становится unhandled rejection
                // и Node завершает процесс — на Render это выглядит как рестарт-луп
                console.log('MongoDB connect error: ' + error.message);
                this.scheduleReconnect();
            });
    }

    // Слушатели вешаются один раз за жизнь процесса, иначе при каждом
    // переподключении их набор дублируется
    static bindListeners() {
        if (this.listenersBound) {
            return;
        }
        this.listenersBound = true;

        const db = mongoose.connection;

        db.on('connecting', () => console.log('connecting to MongoDB...'));
        db.on('connected', () => console.log('MongoDB connected!'));
        db.on('reconnected', () => console.log('MongoDB reconnected!'));
        db.on('error', (error) => console.log('Error in MongoDb connection: ' + error.message));
        db.on('disconnected', () => {
            console.log('MongoDB disconnected!');
            this.isConnected = false;
            this.scheduleReconnect();
        });
    }

    // Один таймер на все попытки: иначе параллельные события плодят реконнекты
    static scheduleReconnect() {
        if (this.reconnectTimer || mongoose.connection.readyState === 1) {
            return;
        }

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            console.log('reconnecting to MongoDB...');
            this.openConnection();
        }, RECONNECT_DELAY);
    }
}

module.exports = MongoDBConnection;
