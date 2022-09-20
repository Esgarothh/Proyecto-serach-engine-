from unittest import expectedFailure
import requests
import yake
from requests.exceptions import Timeout
from bs4 import BeautifulSoup, SoupStrainer
from alive_progress import alive_bar
language = "en"
max_ngram_size = 3
deduplication_threshold = 0.9
deduplication_algo = 'seqm'
windowSize = 1
numOfKeywords = 5

only_a_tags = SoupStrainer("title")


file = open("oneurl.txt", "r")
#nuevo = open("url_plus_title_plus_description.txt", 'w')
archivo = open("1FULL.txt", 'w')
archivo2 = open("2ID-DOMAIN.txt", 'w')


def crawler(start, end):
    cont = start
    while cont < end:
        yield
        url = file.readline().replace('\n', "")
        if url == "":
            break
        try:
            response = requests.get(url, timeout=0.3)

            soup = BeautifulSoup(response.text, features="lxml")
            metas = soup.find_all('meta', limit=20)
            titulos = soup.title
            descripcion = ""
            keywords = ""
            for meta in metas:
                if 'name' in meta.attrs and meta.attrs['name'] == 'keywords' and meta.attrs['content']:
                    keywords = meta.attrs['content']
                    keywords = keywords.replace("\n|\r|\t", "").strip()
                    keywords = keywords.split(',')  # LISTA DE KEYWORDS
                if 'name' in meta.attrs and meta.attrs['name'] == 'description' and meta.attrs['content']:
                    descripcion = meta.attrs['content']
                    descripcion = descripcion.strip()
                    descripcion = "".join(descripcion.splitlines())
                    print(descripcion)
                if descripcion != "" and keywords != "" and titulos.contents != "":
                    titulo = titulos.contents[0].replace(
                        "\n|\r|\t", "").strip()  # if EXISTEN desc keys and title
                    value = (str(cont) + ' $ ' +
                             titulo+" $ " + descripcion+' $ '+url+'\n')
                    for key in keywords:
                        archivo2.write(str(cont)+" - "+key+'\n')

                    cont += 1
                    archivo.write(value)
                    keywords = ""
                    descripcion = ""
                    titulos = ""
                    break
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            pass


start = input("Please enter a starting point :\n")
end = input("Please enter a end point:\n")
duration = int(end)-int(start)
with alive_bar(duration) as bar:
    for i in crawler(int(start), int(end)):
        bar()


# soup = BeautifulSoup(response.text, features="lxml", parse_only=only_a_tags)

# print([meta.attrs['content']
#     for meta in metas if 'name' in meta.attrs and meta.attrs['name'] == 'description'])
