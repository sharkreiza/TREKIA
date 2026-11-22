function iniciarSesion(correo: string, password: string) {
  cy.visit('/login');
  cy.get('input[type=email]').type(correo);
  cy.get('input[type=password]').type(password);
  cy.contains('ion-button', 'Iniciar sesión').click();
}

describe('Trekia', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('sin sesión redirige al inicio de sesión', () => {
    cy.visit('/app/inicio');
    cy.url().should('include', '/login');
    cy.contains('h1', 'Iniciar sesión');
  });

  it('valida el formulario de inicio de sesión', () => {
    cy.visit('/login');
    cy.contains('ion-button', 'Iniciar sesión').click();
    cy.contains('Ingresa tu correo');
    cy.contains('Ingresa tu contraseña');
  });

  it('muestra el error de credenciales incorrectas', () => {
    iniciarSesion('usuario@gmail.com', 'ClaveIncorrecta1');
    cy.contains('Credenciales inválidas');
  });

  it('el usuario ve el detalle de una ruta con el pronóstico del tiempo', () => {
    iniciarSesion('usuario@gmail.com', 'Trekia123');
    cy.url().should('include', '/app/inicio');
    cy.visit('/app/rutas');
    cy.contains('Laguna El Yeso').click();
    cy.contains('h1', 'Laguna El Yeso');
    cy.contains('Pronóstico del tiempo');
  });

  it('el usuario no puede entrar a la administración', () => {
    iniciarSesion('usuario@gmail.com', 'Trekia123');
    cy.url().should('include', '/app/inicio');
    cy.visit('/admin/propuestas');
    cy.url().should('include', '/app/inicio');
  });

  it('el usuario ve sus notificaciones', () => {
    iniciarSesion('usuario@gmail.com', 'Trekia123');
    cy.url().should('include', '/app/inicio');
    cy.visit('/app/notificaciones');
    cy.contains('Sofía Torres te envió una solicitud de amistad');
  });

  it('el administrador entra al panel de propuestas', () => {
    iniciarSesion('admin@gmail.com', 'Admin123');
    cy.url().should('include', '/admin/propuestas');
  });
});
