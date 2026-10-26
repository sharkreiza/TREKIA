function esDuenoOAdmin(usuario, duenoId) {
  return usuario.rol === 'administrador' || usuario.id === duenoId;
}

module.exports = { esDuenoOAdmin };
