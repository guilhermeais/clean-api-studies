# Alias com paramêtros
É possível criar alias que recebam paramêtros e utilizem esses paremêtros para realizar algumas ações repetidas.

Por exemplo...

Para criarmos uma tag anotada, utilizamos o comando `git tag -a nome_da_tag -m mesagem_da_tag`, precisamos adicionar o nome e uma mensagem para essa tag (geralmente a mensagem é o mesmo que o nome)

Então, podemos simplificar esse comando com um alias:
```
[alias]
    t = !sh -c 'git tag -a $1 -m $1' -
```

Basicamente, nós utilizamos o shell para chamar o comando de criação de tag do git, e utilizamos o primeiro parametro recebido `$1` para nomear e dar uma mensagem a tag.