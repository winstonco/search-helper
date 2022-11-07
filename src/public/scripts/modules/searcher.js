/**
 * @instance A SearchQuery with key terms, ignored words, required words, and tags.
 * @example
 * Given: 'how to play piano --practice !-easy t-fast'
 * -> terms = ['how', 'to', 'play', 'piano']
 * -> ignore = ['practice']
 * -> require = ['easy']
 * -> tags = ['fast']
 */
class SearchQuery {
  terms = [''];
  ignore = [''];
  require = [''];
  tags = [''];
}

const SEAPI = 'https://api.stackexchange.com/2.3/';

/**
 * A class containing methods to search a source.
 */
export class Searcher {
  /**
   * Given a search query containing terms and operators/operands,
   * returns a SearchQuery object.
   * @param {string} search The search query as a string.
   * @returns {SearchQuery} The query as a SearchQuery object.
   */
  toSearchQuery(search) {
    if (typeof search != 'string') {
      throw new Error('Search is not a string.');
    }
    const sq = new SearchQuery();
    sq.ignore = findOperands(search, '-'); // Find ignores
    sq.require = findOperands(search, '!'); // Find requires
    // Find the rest
    let terms = search;
    sq.ignore.concat(sq.require).forEach((word) => {
      terms = terms.replace(word, '');
    });
    terms =
      ' ' +
      terms.replaceAll('-', '').replaceAll('!', '').replace(/\s+/g, ' ').trim();
    sq.terms = findOperands(terms, ' ');
    return sq;
  }

  /**
   * Takes a SearchQuery instance and returns a list of relevant articles.
   * @async
   * @param {string} site The site property in the SE API call.
   * @param {SearchQuery} query The SearchQuery.
   * @returns {Promise<{title, link}[]>} An array of {title, link} objects.
   */
  async searchStackExchange(site, query) {
    if (!(query instanceof SearchQuery)) {
      throw new Error('Query is not a SearchQuery.');
    }
    let reqURL = SEAPI;
    reqURL += 'search/advanced?pagesize=30&order=desc&sort=relevance&';
    if (query.terms) {
      reqURL += `q=${query.terms.join(' ')}&`;
    }
    if (query.require) {
      reqURL += `body=${query.require.join(' ')}&`;
    }
    if (site) {
      reqURL += `site=${site}`;
    }

    console.log('Request: ' + reqURL);
    const response = await fetch(reqURL);
    const body = await response.json();
    let items = body.items;
    let articles = [];
    items.forEach((item) => {
      articles.push({ title: item.title, link: item.link });
    });
    return articles;
  }
}

/**
 * Finds operands in a string denoted by (operator)(operand).
 * @param {string} string The full string to search.
 * @param {string} operator The operator to check for (e.g. -, !, t-).
 * @returns {string[]} An array of found operands.
 *
 * @example
 * var prompt = 'how to -good learn chinese -happy -expensive';
 * findOperands(prompt, '-');
 * -> ['good', 'happy', 'expensive']
 */
function findOperands(string, operator) {
  const operands = [];
  let index = string.indexOf(operator, 0);
  while (index != -1) {
    let spaceIndex = string.indexOf(' ', index + 1);
    if (spaceIndex === -1) {
      spaceIndex = string.length;
    }
    operands.push(string.slice(index + 1, spaceIndex));
    index = string.indexOf(operator, index + 1);
  }
  return operands;
}
