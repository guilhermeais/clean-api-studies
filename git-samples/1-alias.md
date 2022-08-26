# Criando atalhos para comandos do git!

## Listar todas configurações da maquina
- `git config --list`
  Níveis de configurações do config:
    - `--system`: Pra máquina toda, qualquer projeto e/ou usuário do computador;
    - `--global`: Configurações do seu usuário pra qualquer projeto;
    - `--local`: Configurações de um projeto especifico

## Editar as configurações
Para conseguirmos editar as configurações, basta digitarmos `git config --[nível] --edit` <small> O nível é referente ao **system**, **global** ou **local**</small>

Isso irá abrir um editor, que algumas pessoas talvez não achem tão interessante, então podemos trocar o nosso editor de configurações do git, pelo seguinte comando:
`git config --global core.editor [nom,e_do_editor]`, no nome do editor, podemos colocar o **code**, por exemplo, que é o VsCode

Agora, ao digitarmos `git config --global --edit`, por exemplo, será aberto o vsCode com o .gitconfig, mais ou menos assim:

```
[user]
	email = guilherme.teixeira@ctctech.com.br
	name = Guilherme Teixeira Ais
	signingKey = FB479407A3B911EE
[credential]
	helper = cache
[core]
	editor = code --wait // aqui são as configurações do editor, ali eu falo pra usar o vsCode e uso a tag `--wait`, demodo que ele espere o git recuperar as configurações do usuário
```

### Criando os 'alias'
Para criarmos atalhos, podemos usar o grupo [alias], mais ou menos assim:

[alias]
	s = !git status -s

Isso irá criar o atalho `git s`, que irá executar o comando `git status -s`.
Os atalhos que vamos adicionar, serão estes:

```
[alias]
	s = !git status -s
	c = !git add --all && git commit -m
	l = !git log --pretty=format:'%C(blue)%h %C(red)%d%C(white)%s - %C(cyan)%cn, %C(green)%cr'
```

Repare que mudamos bastante nosso git log. Isso são configurações de como queremos exibir os logs do nosso git, estas configurações conseguimos achar na documentação do Git.

### Documentações
- [Git Alias](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases)
- [Git Log](https://git-scm.com/docs/git-log)