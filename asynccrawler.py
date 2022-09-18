import asyncio
from queue import Full
import aiohttp
import time
from unittest import expectedFailure
import requests
import yake
from requests.exceptions import Timeout
from bs4 import BeautifulSoup, SoupStrainer
from alive_progress import alive_bar
import psycopg2
# archivo = open("1FULL.txt", 'w')
# archivo2 = open("2ID-DOMAIN.txt", 'w')

full = {}
keys = {}

try:
    conn = psycopg2.connect(
        host="172.17.0.1",
        database="my_database",
        user="my_user",
        password="password123")
    cur = conn.cursor()
except Exception as e:
    print()


def urlToList():
    # with open("smallurl.txt", "r") as f:
    with open("nodup.txt", "r") as f:
        mylist = f.read().splitlines()
    print("done")
    return mylist


async def sopa(s, url, cont):
    try:
        async with s.get(url=url) as response:
            response = await response.read()
            # print("here")
            soup = BeautifulSoup(response, features="lxml")
            metas = soup.find_all('meta', limit=10)
            titulos = soup.find('title')
            descripcion = ""
            keywords = ""
            for meta in metas:
                if 'name' in meta.attrs and meta.attrs['name'] == 'keywords' and meta.attrs['content']:
                    keywords = meta.attrs['content']
                    keywords = keywords.split(',')  # LISTA DE KEYWORDS
                if 'name' in meta.attrs and meta.attrs['name'] == 'description' and meta.attrs['content']:
                    descripcion = meta.attrs['content']
                    descripcion = descripcion.strip()
                    descripcion = "".join(descripcion.splitlines())
                if descripcion != "" and keywords != "" and titulos.contents != "":

                    # if EXISTEN desc keys and title
                    titulo = titulos.contents[0].strip()
                    titulo = "".join(titulo.splitlines())

                    titulo = titulo[:200]
                    descripcion = descripcion[:500]
                    url = url[:50]
                    # value = (str(cont) + ' $ ' +titulo+" $ " + descripcion+' $ '+url+'\n')
                    value = (titulo+" $ " + descripcion+' $ '+url+'\n')
                    full[cont] = value
                    cur.execute("""INSERT INTO datos(id,titulo,descripcion,url) VALUES (%s,%s,%s,%s);""", (
                        cont, titulo, descripcion, url,))

                    conn.commit()
                    for key in keywords:
                        if len(key) > 100:
                            key = key.split()[:1]
                        keys[cont] = key
                        cur.execute(
                            """INSERT INTO keywords(id,keyword) VALUES (%s,%s);""", (cont, key))
                        conn.commit()
                    # for key in keywords:
                    #    await archivo2.write(str(cont)+" - "+key+'\n')
                    # await archivo.write(value)

                    keywords = ""
                    descripcion = ""
                    titulos = ""
                    return 1
            return 0
    except Exception as e:
        pass


async def get(url, session, cont):
    try:
        async with session.get(url=url) as response:
            resp = await response.read()

            # resp es el content of page
            return await sopa(resp, url, cont)

    except Exception as e:
        pass


async def main(urls, start, max):
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        ret = await asyncio.gather(*[get(urls[i], session, i) for i in range(start, max, 1)])
    print("Finalized all. Return is a list of len {} outputs.".format(
        len(ret))+"max="+str(max))


async def fetch_all(ses, urls, offset):
    tasks = []
    cont = 0+(offset*1000)+1
    if len(urls) >= 1000:
        for i in range(0, 1000, 1):
            task = asyncio.create_task(sopa(ses, urls.pop(i), cont))
            cont += 1
            tasks.append(task)
        res = await asyncio.gather(*tasks)
        return res


lista_url = urlToList()


async def main2(offset):
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        r = await fetch_all(session, lista_url, offset)


a = 0
while a < 500:
    asyncio.run(main2(a))
    a += 1
    print(str(1000*a)+"done")
    with open('1FULL.txt', 'w') as f:
        f.writelines('{}:{}'.format(k, v) for k, v in full.items())
    with open('2ID-DOMAIN.txt', 'w') as f:
        f.writelines('{}:{}\n'.format(k, v) for k, v in keys.items())


max = 1000
start = 0
while max <= 1:
    asyncio.run(main(lista_url, start, max))
    start = max+1
    max += 1000
