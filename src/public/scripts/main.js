import { Searcher } from './modules/searcher.js';

const searcher = new Searcher('languagelearning');

let question = 'how to -good learn chinese -happy -expensive';

let sq = searcher.toSearchQuery(question);
console.log(sq);

let articles = await searcher.searchStackExchange('languagelearning', sq);
console.log(articles);

const listArticles = document.getElementById('articles');
articles.forEach((article) => {
  let li = document.createElement('li');
  let articleLink = li.appendChild(document.createElement('a'));
  articleLink.href = article.link;
  articleLink.target = '_blank';
  articleLink.rel = 'noopener noreferrer';
  articleLink.innerHTML = article.title;
  listArticles.appendChild(li);
});
