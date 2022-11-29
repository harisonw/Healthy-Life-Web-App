const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fname: { type: String, required: true },
    newsletter: { type: Boolean, required: true },

    sex: { type: String },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    avgHrsExercisePW: { type: String },
    avgStepsPD: { type: String },
    eatingHabits: { type: String },
    avgHrsSleepPD: { type: String },
    avgUnitsAlcoholPW: { type: String },
    //avgCigsPD: { type: String },
    occupation: { type: String },
    restingHR: { type: Number },


}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);