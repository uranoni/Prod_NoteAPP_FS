const express = require('express')
const bodyParser = require('body-parser')
const randomToken = require('random-token');
const cors = require('cors')
const mongoose = require('mongoose');
const {
	User
} = require('./models/user')
const {
	Todo
} = require('./models/todo')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/noteapp', function (err) {
	if (err) {
		console.log('Connection error');
	}
}, {
	useNewUrlParser: true
});
const initUser = () => {
	var token = randomToken(16);
	User.find({
		'name': "admin"
	}).then((result) => {
		if (result.length == 0) {
			let user = new User({
				"email": "admin@admin.com",
				"password": "admin123",
				"name": "admin",
				"tokens": [{
					token
				}],
				"role": "admin"
			})
			user.save().then(() => {
				console.log("init mongodb")
			}).catch((err) => {
				console.log(err)
			})
		} else {
			console.log("already admin user")
		}
	}).catch(err => {

		return Promise.reject(new Error('woops'));

	})
}

const initTodo = () => {
	Todo.find({
		'todoname': 'mytodo'
	}).then((result) => {
		if (result.length == 0) {
			var todos = new Todo({
				"todoname": "mytodo",
				"content": "Hello world!!"
			})
			todos.save().then(() => {
				console.log("init mongodb success");
			}).catch((err) => {
				console.log(err)
			})
		} else {
			console.log("already success")
		}

	})
}
initTodo();
initUser();
// 登入
app.post('/login', (req, res) => {
	const {
		email,
		password
	} = req.body
	const userdata = {}
	userdata.email = email
	userdata.password = password
	const userresult = User.findOne({
		"email": userdata.email
	}).then((result) => {
		if (!result) {
			return Promise.reject()
		} else if (result.password == userdata.password) {
			result.tokens.push({
				token: randomToken(16)
			})
			return result.save()
		} else {
			return Promise.reject()
			//   return res.status(401).send("bad gateway")
		}
	}).then((result) => {

		res.send(result)
	}).catch((err) => {
		res.status(401).send("登入錯誤");
	})

})


// 登出

app.delete('/logout', async (req, res) => {
	const token = req.header('token')
	try {
		User.findOneAndUpdate({
			"tokens.token": token
		}, {
			$pull: {
				tokens: {
					token
				}
			}
		}).then((result) => {
			console.log(result)
			if (!result) {

				return Promise.reject("can't findtoken")

			}
			res.send({
				name: result.name,
				msg: "登出成功"
			})
		}).catch((err) => {
			console.log(err)
			res.status(404).send(err)
		})

	} catch (error) {
		res.status(404).send("Token錯誤")
	}


})


app.post('/rewrite', async (req, res) => {

	const result = await Todo.findOneAndUpdate({
		todoname: "mytodo"
	}, {
		$set: {
			content: req.body.context
		}
	});
	if (!result) {
		// If the document doesn't exist


		res.status(401).send('can not create')


	} else {
		res.send(result)
	}

})

app.get('/getTodo', async (req, res) => {
	const result = await Todo.findOne({
		todoname: "mytodo"
	})
	if (!result) {
		res.status(404).send("Not found")
	} else {
		res.send(result)
	}
})

app.listen(8888, () => {
	console.log("http://localhost:8888")
})