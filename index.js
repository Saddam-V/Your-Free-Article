const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////
// Files

// //synchronous reading
// textn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textn);
// console.log("Read Complete")

// // Asynchronous Reading

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     if(err) return console.log("Error");
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1)=>{
//         console.log(data1);
//         fs.readFile('./txt/append.txt','utf-8',(err,data2)=>{
//             console.log(data2)
//             fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,'utf-8',(err,data)=>{
//                 console.log("File Created Successfully")
//             });
//         });
//     });
// });
// console.log('Reading')

/////////////////////////////////////////////////
// Server
// Reading Files -----------------------------------------------------------------
const startPage = fs.readFileSync('./starter/templates/StartPage.html', 'utf-8');
const catPage = fs.readFileSync('./starter/templates/Categories.html', 'utf-8');
const tempCard = fs.readFileSync('./starter/templates/template-card.html', 'utf-8');
// const tempOv = fs.readFileSync('./starter/templates/overview.html', 'utf-8');

const data = fs.readFileSync('./starter/dev-data/data.json', 'utf-8');

const dataobj = JSON.parse(data);
// -----------------------------------------------------------------------------------

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%CARD-TITLE%}/g, product.cardTitle);
  output = output.replace(/{%CARD-TEXT%}/g, product.cardText);
  return output;
};

const server = http.createServer((req, res) => {
  // Parsing Url ---------------------------------------------------------
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const templatePage = dataobj.map((el) => replaceTemplate(tempCard, el)).join('');
    const finalPage = startPage.replace(/{%CARD%}/g, templatePage);
    res.end(finalPage);
  } else if (pathname === '/categories') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    console.log(query);
    res.end(catPage);
  } else if (req.url.indexOf('.css') != -1) {
    //req.url has the pathname, check if it conatins '.css'

    fs.readFile(__dirname + '/public/styles/styles.css', function (err, data) {
      if (err) console.log(err);
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      res.end();
    });
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'some-else': 'else',
    });
    res.end('<h1>Page Not Found</h1>');
  }

  console.log('server created \n');
  // res.end('Hey World');
});

const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env;
server.listen(PORT, LOCAL_ADDRESS, () => {
  const address = server.address();
  console.log('server hearing at an', address);
});
