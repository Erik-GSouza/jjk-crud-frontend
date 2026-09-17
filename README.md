# Frontend do CRUD de Personagens

Frontend simples em HTML, CSS e JavaScript que utiliza todas as rotas do backend.

## Executar

1. Abra a pasta em um terminal
2. Execute um servidor HTTP local:

```bash
npx serve .
```

3. Abra no navegador o endereço informado pelo comando.

Não abra o arquivo `index.html` diretamente. O servidor HTTP é necessário para o funcionamento correto do PWA.

## Endereço da API

O endereço está definido no início do arquivo `app.js`:

```javascript
const API_URL = "https://jjk-crud-backend.onrender.com/personagens";
```

O backend está hospedado no Render e conectado ao MongoDB Atlas.

## Operações disponíveis

| Ação | Método | Rota |
|---|---|---|
| Listar personagens | GET | `/personagens` |
| Buscar por ID | GET | `/personagens/:id` |
| Cadastrar | POST | `/personagens` |
| Atualizar | PUT | `/personagens/:id` |
| Excluir | DELETE | `/personagens/:id` |

## Dados do personagem

`{
  "nome": "Satoru Gojo",
  "categoria": "Feiticeiro",
  "tecnica": "Limitless"
}`
