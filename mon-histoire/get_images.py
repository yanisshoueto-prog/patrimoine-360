import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

terms = ["Benin bronze", "Gelede", "Egungun", "Dahomey", "African mask", "African sculpture"]
for term in terms:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(term)}&prop=images&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, context=ctx).read().decode()
    data = json.loads(response)
    pages = data['query']['pages']
    for page_id in pages:
        images = pages[page_id].get('images', [])
        for img in images:
            title = img['title']
            if title.lower().endswith(('.jpg', '.png')):
                # Get image URL
                img_url_req = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                req2 = urllib.request.Request(img_url_req, headers={'User-Agent': 'Mozilla/5.0'})
                res2 = urllib.request.urlopen(req2, context=ctx).read().decode()
                res_data = json.loads(res2)
                p2 = res_data['query']['pages']
                for p_id in p2:
                    info = p2[p_id].get('imageinfo', [])
                    if info:
                        print(f'"{term}": "{info[0]["url"]}"')
                        break
                break
