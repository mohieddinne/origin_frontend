import { Selector } from 'testcafe';

fixture `Login`
    .page `https://staging.intranet.origin.expert/`;

test('Valid password', async t => {
    await t
        .click('#login-email')
        .typeText('#login-email', 'testauto@globetechnologie.com')
        .click('#login-password')
        .typeText('#login-password', 'hJjv5E2ek4h5bU6!', {
            caretPos: 0
        })
        .click('#login-button')
        .expect(Selector('.email').textContent).eql("testauto@globetechnologie.com");
});

test('Invalid password', async t => {
    await t
        .click('#login-email')
        .typeText('#login-email', 'testauto@globetechologie.com')
        .click('#login-password')
        .typeText('#login-password', 'hJjv5E2ek4h5bU6', {
            caretPos: 0
        })
        .click('#login-button')
        .expect(Selector('#login-password-helper-text').textContent).eql("Mot de passe erroné")
        .expect(Selector('#login-password-helper-text').getStyleProperty('color')).eql("rgb(244, 67, 54)");
});

test('Message d\'erreur', async t => {
    await t
        .typeText('#login-email', 'test')
        .expect(Selector('#login-email-helper-text').textContent).eql("Doit etre une adresse email valide")
        .expect(Selector('#login-button').getAttribute('disabled')).eql("")
        .typeText('#login-email', 'test@test.ca')
        .expect(Selector('#login-button').getAttribute('disabled')).eql("")
        .typeText('#login-password', 'test')
        .expect(Selector('#login-button').getAttribute('disabled')).eql(undefined);
});

test('Mot de passe Erreur', async t => {
    await t
        .click('#forgot-password-link')
        .typeText('#forgot-password-email', 'testauto')
        .expect(Selector('#forgot-password-email-helper-text').textContent).eql("Doit etre une adresse email valide")
        .expect(Selector('#forgot-password-button').getAttribute('disabled')).eql("")
        .typeText('#forgot-password-email', 'validmail@test.example')
        .click(Selector('#forgot-password-button span').withText('ENVOYER'))
        .expect(Selector('#forgot-password-email-helper-text').textContent).eql("Aucun utilisateur trouvé");
});

test('Mot de passe oublié', async t => {
    await t
        .resizeWindow( 1280, 1024 )
        .expect(Selector('#forgot-password-link').getAttribute('href')).eql("/auth/forgot-password")
        .click('#forgot-password-link')
        .expect(Selector('#fuse-layout a').withText('Retourner à la page de connexion').getAttribute('href')).eql("/login")
        .typeText('#forgot-password-email', 'testauto@globetechnologie.com')
        .click(Selector('#forgot-password-button span').withText('ENVOYER'))
        .expect(Selector('#forgot-password-success-message').textContent).eql("Un email est envoyé à votre adresse email avec les étapes à suivre pour réinitialiser votre mot de passe")
        .wait(5000)
        .navigateTo('https://globetechnologie.com:2096/')
        .typeText('#user', 'testauto@globetechnologie.com')
        .typeText('#pass', '9BKGe2-9QSGWm-Uj99')
        .click('#login_submit')
        .wait(1600)
        .doubleClick('#messagelist > tbody > tr:first-child  ')
        .click(Selector('#messagebody a').withText('Réinitialisez votre mot de passe'))
        .typeText('#reset-password-password', 'hJjv5E2ek4h5bU6!')
        .typeText('#reset-password-password2', 'hJjv5E2ek4h5bU6!')
        .click(Selector('#reset-password-button span').withText('ENVOYER'))
});
/*
.after( 
    async t => {
        await t
            .resizeWindow(1280, 1024)
            .navigateTo('https://globetechnologie.com:2096/')
            .typeText('#user', 'testauto@globetechnologie.com')
            .typeText('#pass', '9BKGe2-9QSGWm-Uj99')
            .click('#login_submit')
            .wait(1600)
            .click(Selector('#toolbar-list-menu span').withText('Sélectionner'))
            .click('#rcmbtn147')
            .click('#rcmbtn123')
            .click('#rcmbtn109');
});
*/
