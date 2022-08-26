# Criando tags para nosso repositório
Para criarmos tags, utilizamos o comanod ```git tag "nome_da_tag" ```  

Essas tags são indicadas somente para controlar localmente, agora, se for realmente for fazer tags de release para o seu servidor, por exemplo, o ideal é usar o ``` git tag -a "nome_da_tag"``` que cria tags do tipo **anotaded**


## Para enviarmos a nossa tag junto do commit:
Podemos usar o ```git push --tags``` para enviar todas tags
Podemos usar o ```git push --follow-tags``` para enviar tags do tipo **anotaded**