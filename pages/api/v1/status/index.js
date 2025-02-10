function status(request, response) {
  response.status(200).json({
    chave: "Se isso deu certo dou uma binbadinha 🙂",
  });
}

export default status;
