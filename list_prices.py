import re

def inspect_file(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()

    pattern = re.compile(
        r'(<(?:h3|div)[^>]*class="(?:product-name|trending-name|latest-name|card-title)"[^>]*>(.*?)</(?:h3|div)>[\s\S]*?<(?:span|div)[^>]*class="(?:current-price|trending-current-price|latest-current-price|card-sale-price)"[^>]*>(.*?)</(?:span|div)>)',
        re.DOTALL
    )

    matches = pattern.findall(text)
    print(f"=== {fname}: {len(matches)} products ===")
    for _, name, price in matches:
        print(f"{name.strip()} -> {price.strip()}")

inspect_file('index.html')
inspect_file('collections.html')
