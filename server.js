import express from 'express';

const app = express();

app.use(express.static("public"));
app.listen(8080, () => {
  console.log("listening on port 8080");
});

app.get("/yay", (req, res) => {
  res.json({ "yay" : "yayyy"});
})