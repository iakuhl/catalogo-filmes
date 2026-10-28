import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecalho from "../Cabecalho/Cabecalho";
import Rodape from "../Rodape/Rodape";
import Notificacao from "../Notificacao/Notificacao";
import "./Layout.css";

const Layout = () => {
  const { pathname } = useLocation();

  // Notificação exibida no canto da tela (ex.: "Filme cadastrado").
  // Ela fica no Layout porque o Layout continua na tela quando a página
  // muda; assim a mensagem aparece mesmo depois de um navigate().
  const [notificacao, setNotificacao] = useState(null);

  const notificar = useCallback((texto, tipo = "sucesso") => {
    setNotificacao({ texto, tipo, id: Date.now() });
  }, []);

  // Esconde a notificação depois de alguns segundos
  useEffect(() => {
    if (!notificacao) return;
    const temporizador = setTimeout(() => setNotificacao(null), 4500);
    return () => clearTimeout(temporizador);
  }, [notificacao]);

  // Ao trocar de página, volta para o topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="layout">
      <Cabecalho />

      <main className="layout__conteudo container">
        {/* As páginas acessam notificar() com useOutletContext() */}
        <Outlet context={{ notificar }} />
      </main>

      <Rodape />

      <Notificacao notificacao={notificacao} aoFechar={() => setNotificacao(null)} />
    </div>
  );
};

export default Layout;
