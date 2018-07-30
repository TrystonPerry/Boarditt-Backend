const mongoose = require('mongoose'),
      Board = require('./models/board'),
      List = require('./models/list'),
      Todo = require('./models/todo');

const boards = [
  {
    title: 'Personal Board',
    lists: [
      {
        title: 'Chores',
        todos: [
          {
            value: 'Take dog for walk',
            isDone: false
          },
          {
            value: 'Go shopping',
            isDone: false
          },
          {
            value: 'Finish developing Boarditt',
            isDone: false
          }
        ]
      },
      {
        title: 'Shopping List',
        todos: [
          {
            value: 'Eggs',
            isDone: false
          },
          {
            value: 'Milk',
            isDone: false
          },
          {
            value: 'Chicken',
            isDone: false
          }
        ]
      }
    ]
  }
]

function seedDB() {
  boards.forEach(function(board){
    Board.create({title: board.title}).then(createdBoard => {
      board.lists.forEach(function(list, i){
        List.create({title: list.title}).then(createdList => {
          createdBoard.lists.push(createdList._id);
          if(i === board.lists.length - 1){
            createdBoard.save();
          }
          list.todos.forEach(function(todo, j){
            Todo.create({value: todo.value, isDone: todo.isDone}).then(createdTodo => {
              createdList.todos.push(createdTodo._id);
              if(j === list.todos.length - 1){
                createdList.save();
              }
            })
          })
        })
      })
    })
  })
}

module.exports = seedDB;