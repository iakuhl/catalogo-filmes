import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecalho from "../Cabecalho/Cabecalho";
import Notificacao from "../Notificacao/Notificacao";
import "./Layout.css";

// Estrutura comum a todas as telas: o menu superior e o conteúdo da rota
const Layout = () => {
  const { pathname, search } = useLocation();

  // Notificação exibida no canto da tela (ex.: "Filme criado").
  // Ela fica no Layout porque o Layout continua na tela quando a página
  // muda; assim a mensagem aparece mesmo depois de um navigate().
  const [notificacao, setNotificacao] = useState(null);

  const notificar = useCallback((texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo, id: Date.now() });
  }, []);

  // Esconde a notificação depois de alguns segundos
  useEffect(() => {
    if (!notificacao) return;
    const temporizador = setTimeout(() => setNotificacao(null), 5000);
    return () => clearTimeout(temporizador);
  }, [notificacao]);

  // Ao trocar de tela (ou de página da lista), volta para o topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="layout">
      <Cabecalho />

      <main className="layout__conteudo container">
        {/* As telas acessam notificar() com useOutletContext() */}
        <Outlet context={{ notificar }} />
      </main>

      <Notificacao notificacao={notificacao} aoFechar={() => setNotificacao(null)} />
    </div>
  );
};

export default Layout;
