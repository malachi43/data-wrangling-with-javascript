
const url = `https://github.com/data-wrangling-with-javascript/chapter-2`
import cheerio from 'cheerio'
import axios from 'axios'

async function loadPage(url) {
    const { data } = await axios.get(url)
    return data
}

const html = await loadPage(url)
const $ = cheerio.load(html)

const titles = $('.js-navigation-open').map((i, el) => {
    return $(el).text()
}).get().join('|')

console.log("titles: ", titles)
