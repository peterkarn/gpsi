let asyncCss = `<script>
function loadStyle(url){
	let link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.body.appendChild(link);
}
loadStyle('css/main.css');
</script>`;

const express = require('express');
const path = require('path');
let fs = require('fs');

const app = express();

app.use('/css', express.static(path.resolve(__dirname, './dist/css')));
app.use('/js', express.static(path.resolve(__dirname, './dist/js')));
app.use('/img', express.static(path.resolve(__dirname, './dist/img')));
app.use('/fonts', express.static(path.resolve(__dirname, './dist/fonts')));

app.get('*', (request, response) => {
  let page = ('page' in request.query) ? request.query.page : 'index';
  console.log(page);
	// must validate page on real site

	let isCritical = 'crit' in request.query;
	let incAsync = 'async' in request.query;

	let criticalCss = fs.readFileSync(`./dist/css/${page}-critical.css`).toString('UTF-8');
	let html = fs.readFileSync(`./dist/${page}.html`).toString('UTF-8');
	
	if(isCritical){
		html = html.replace('<link rel="stylesheet" href="css/main.css">', `<style>${criticalCss}</style>`);

		if(incAsync){
			html = html.replace('</body>', `${asyncCss}</body>`);
		}
	}
	
	response.send(html);
});

app.listen(3003);

//