from unittest import expectedFailure
import requests

from requests.exceptions import Timeout
from bs4 import BeautifulSoup, SoupStrainer


only_a_tags = SoupStrainer("title")

url = 'https://www.libertytribute.com/'
url = "https://coa-aco.org/"
file = open("smallurl.txt", "r")
nuevo = open("url_plus_title_plus_description.txt", 'w')
cont = 1
while True:
    url = file.readline().replace('\n', "")
    if url == "":
        break
    try:
        try:
            response = requests.get(url, timeout=2)
            print(url)
        except Timeout:
            response.close()
        soup = BeautifulSoup(response.text, features="lxml")
        metas = soup.find_all('meta')
        titulos = soup.find('title')
        for meta in metas:
            if 'name' in meta.attrs and meta.attrs['name'] == 'description' and titulos.contents:
                descripcion = meta.attrs['content']
                titulo = titulos.contents[0].replace('\n', "")
                print(titulo)
                value = (str(cont) + ',' +
                         titulo+"," + meta.attrs['content']+','+url+'\n')
                cont += 1
                nuevo.write(value)
                print(value)
                break
    except requests.exceptions.ConnectionError:
        print("Failed")


# soup = BeautifulSoup(response.text, features="lxml", parse_only=only_a_tags)

# print([meta.attrs['content']
#     for meta in metas if 'name' in meta.attrs and meta.attrs['name'] == 'description'])
