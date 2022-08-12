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

const tempCard = fs.readFileSync('./starter/templates/template-card.html', 'utf-8');
const tempOv = fs.readFileSync('./starter/templates/overview.html', 'utf-8');

const data = fs.readFileSync('./starter/dev-data/data.json', 'utf-8');

const dataobj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const templatePage = dataobj.map((el) => replaceTemplate(tempCard, el)).join('');
    const finalPage = tempOv.replace(/{%PRODUCT_BODY%}/g, templatePage);
    res.end(finalPage);
  } else if (pathName === '/products') {
    res.end('This is Products');
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

server.listen(process.env.PORT || 8000, '127.0.0.1', () => {
  console.log('the third argument i.e. callback function is optional');
});
