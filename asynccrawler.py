import asyncio
import aiohttp
from unittest import expectedFailure
from requests.exceptions import Timeout
from bs4 import BeautifulSoup
from alive_progress import alive_bar
import psycopg2

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


async def main(offset):
    timeout = aiohttp.ClientTimeout(total=30)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        r = await fetch_all(session, lista_url, offset)


a = 0
while a < 500:
    asyncio.run(main(a))  # inicio programa, carga 1000 URL a la vez
    a += 1
    print(str(1000*a)+"done")
