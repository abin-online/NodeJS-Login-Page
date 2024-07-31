const express = require('express')
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');

const session = require('express-session');

app.use(express.static('public'));

app.set('view engine', 'hbs')
const username = "admin"
const password = "123"

app.use(express.urlencoded({ extended: true}));
app.use(express.json())



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(nocache())

app.get('/', (req, res) =>{

    if(req.session.user){
        res.render('home');   
    }else{

        if(req.session.passwordwrong){
        res.render('login',{msg:'Invalid username or password'})
        req.session.passwordwrong = false;
        }else{
            res.render('login')
        }
    }
    
}
)

app.post('/verify',(req,res) =>{

    console.log(req.body);

    if(req.body.username === username && req.body.password === password){
        req.session.user = req.body.username
        res.redirect('/home')
    }
    else{
            req.session.passwordwrong = true;  
            res.redirect('/')
    }
    // res.send('success')

})


app.get('/home',(req,res) =>{

    if(req.session.user){

        res.render('home')

    }else{
        if(req.session.passwordwrong){
        req.session.passwordwrong = false;
        res.render('login',{msg:"Invalid username or password"})  
        }else{
            res.render('login')
        }
    }
})


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.render('login', { msg: "Logged out" });
    });
});




app.listen(3003, () => console.log("http://localhost:3003"));