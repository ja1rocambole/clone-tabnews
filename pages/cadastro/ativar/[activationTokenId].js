import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ConfirmRegisterPage() {
  const router = useRouter();
  const activationTokenId = router.query.activationTokenId;
  const [activationStatus, setActivationStatus] = useState("loading");
  const [errorMenssage, seterrorMenssage] = useState("");

  useEffect(() => {
    if (!activationTokenId) {
      return;
    }

    sendActivationTokenId();

    async function sendActivationTokenId() {
      try {
        const response = await fetch(
          `/api/v1/activations/${activationTokenId}`,
          {
            method: "PATCH",
          },
        );

        const activationResponseBody = await response.json();

        if (response.status === 200) {
          setActivationStatus("success");
          return;
        }
        seterrorMenssage(
          `${activationResponseBody.message} ${activationResponseBody.action}`,
        );
        setActivationStatus("failure");
      } catch {
        seterrorMenssage(
          "Houve uma falha de conexão com o servidor. Tente novamente mais tarde",
        );
        setActivationStatus("failure");
      }
    }
  }, [activationTokenId]);

  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Confirme seu email",
      }}
    >
      {activationStatus === "loading" && (
        <Banner variant="info">
          <Banner.Title>Verificando token...</Banner.Title>
        </Banner>
      )}

      {activationStatus === "success" && (
        <Banner variant="success">
          <Banner.Title>Cadastro ativado com sucesso!</Banner.Title>
          <Banner.Description>
            Sua conta está ativa e você já pode{" "}
            <a href="/login">fazer o login</a>.
          </Banner.Description>
        </Banner>
      )}

      {activationStatus === "failure" && (
        <Banner variant="critical">
          <Banner.Title>Não foi possivel ativar seu cadastro.</Banner.Title>
          <Banner.Description>{errorMenssage}</Banner.Description>
        </Banner>
      )}
    </DefaultLayout>
  );
}
