const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({

    todoname: {
        type: String
    },
    content: {
        type: String
    }
});

const Todo = mongoose.model("Todo", TodoSchema);
module.exports = {
    Todo
}