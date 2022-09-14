from unittest import expectedFailure
import requests

from requests.exceptions import Timeout
from bs4 import BeautifulSoup, SoupStrainer

response = requests.get("https://krischase.com/")
soup = BeautifulSoup(response.text, features="lxml")
titulos = soup.find('title')
if titulos.contents:
    print(titulos.contents)
