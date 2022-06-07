const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const { Post, PostSchema } = require("./model/post");

dotenv.config();

mongoose
    .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected with Setthebar DB"))
    .catch((err) => console.log(err));

const express = require("express");
const app = express();
const cors = require("cors");

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

console.log("App listen at port 5000");
app.use(express.json());
app.use(cors(corsOptions));
app.get("/", (req, resp) => {
    resp.send("App is Working");
});

app.get('/api/posts', (req, resp) => {
    Post.find()
        .then((posts) => {
            resp.send(posts);
        })
        .catch((err) => {
            resp.send(err);
        });
})

app.post('/api/createpost', async (req, resp) => {
    const post = new Post({
        img: req.body.img,
        title: req.body.title,
        content: req.body.content,
    });
    await post.save();
    resp.send(post);
})
app.post('/api/updatepost', async (req, resp) => {
    const post = await Post.findById(req.body.id);
    if (post) {
        post.img = req.body.img;
        post.title = req.body.title;
        post.content = req.body.content;
        resp.send(post);
        await post.save();
    } else {
        resp.send("Post not found");
    }
})
app.post('/api/deletepost', (req, resp) => {
    Post.findByIdAndDelete(req.body.id).then(() => {
        resp.send("Post Deleted");
    })
    .catch((err) => {
        resp.send(err);
    })
})


// HERE ILL CALL THE JSON PLACEHOLDER API AND GET THE DATA$


const sendTODB = (data) => {
    data.forEach(async (el) => {
        const post = new Post({
            img: "https://picsum.photos/200/300",
            title: el.title,
            content: el.body,
        });
        await post.save();
    })

}

app.post("/api/jsonplaceholder", (req, resp) => {
    if (req.body.password === "123") {
        axios
            .get("https://jsonplaceholder.typicode.com/posts")
            .then(async (res) => {
                resp.send(res.data);
                const posts = res.data;
                sendTODB(posts)
            })
            .catch((err) => {
                resp.send(err);
            });
    } else {
        resp.send("Wrong Password");
    }

})

app.listen(process.env.PORT || 5000);