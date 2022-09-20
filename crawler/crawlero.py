from xml.etree.ElementTree import tostring
import requests
from requests.utils import quote
import json
import re
#https://hackersandslackers.com/extract-data-from-complex-json-python/
#https://github.com/LIAAD/yake/search?q=url

def json_extract(obj, key):
    """Recursively fetch values from nested JSON."""
    arr = []

    def extract(obj, arr, key):
        """Recursively search for values of key in JSON tree."""
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    extract(v, arr, key)
                elif k == key:
                    arr.append(v)
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr

    values = extract(obj, arr, key)
    return values

p = re.compile(r'(?<!-)\b\a-z+\b(?!-)')

sitio = "sodimac.falabella.com"
http = "https://"+sitio
url= quote(http,safe='')
print(url)
data = requests.get("http://yake.inesctec.pt/yake/v2/extract_keywords_by_url?url="+url+"&max_ngram_size=3&number_of_keywords=3&highlight=false")
#data = p.findall(data.text)
data = json_extract(data.json(),'ngram')
for item in data:
    print(item)

    