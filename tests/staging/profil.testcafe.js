import { Selector } from 'testcafe';

fixture `profil`
    .page `https://staging.intranet.origin.expert/`
    .beforeEach(async t => {
        await t
            .click('#login-email')
            .typeText('#login-email', 'testauto@globetechnologie.com')
            .click('#login-password')
            .typeText('#login-password', 'hJjv5E2ek4h5bU6!', {
                caretPos: 0
            })
            .click('#login-button');
    });

test('Modification mot de passe', async t => {
    await t
        .resizeWindow( 1280, 1024 )
        .navigateTo('/users/profile')
        .typeText('#user-profile-edit-password-oldpassword', 'hJjv5E2ek4h5bU6')
        .typeText('#user-profile-edit-password-password', '12345678901234567890123456')
        .expect(Selector('#user-profile-edit-password-password-helper-text').textContent).eql("25 caractères au maximum")
        .selectText('#user-profile-edit-password-password', 0, 26)
        .pressKey('backspace')
        .typeText('#user-profile-edit-password-password', 'test')
        .expect(Selector('#user-profile-edit-password-password-helper-text').textContent).eql("5 caractères au minimum")
        .typeText('#user-profile-edit-password-password', 's')
        .expect(Selector('#user-profile-edit-password-password-helper-text').textContent).eql("Doit être un mot de passe plus sécuritaire (au moins 1 lettre, 1 chiffre et 1 caractère spécial)")
        .typeText('#user-profile-edit-password-password', '1!')
        .expect(Selector('#user-profile-edit-password-password-helper-text').exists).eql(false)
        .typeText('#user-profile-edit-password-password2', 'tests')
        .expect(Selector('#user-profile-edit-password-password2-helper-text').textContent).eql("Les mots de passe ne sont pas identiques!")
        .typeText('#user-profile-edit-password-password2', '1!')
        .expect(Selector('#user-profile-edit-password-password2-helper-text').exists).eql(false)
        .click(Selector('#user-profile-edit-password-button span').withText('ENREGISTRER'))
        .expect(Selector('#user-profile-edit-password-oldpassword-helper-text').textContent).eql("Votre mot de passe n'est pas bon.")
        .typeText('#user-profile-edit-password-oldpassword', '!')
        .click(Selector('#user-profile-edit-password-button span').withText('ENREGISTRER'))
        .expect(Selector('#fuse-layout .flex.flex-col.justify-center.w-full').find('p').textContent).eql("Votre mot de passe a été réinitialisé.")
        .navigateTo('/users/profile')
        .typeText('#user-profile-edit-password-oldpassword', 'tests1!', {
            caretPos: 0
        })
        .typeText('#user-profile-edit-password-password', 'hJjv5E2ek4h5bU6!')
        .typeText('#user-profile-edit-password-password2', 'hJjv5E2ek4h5bU6!')
        .click(Selector('#user-profile-edit-password-button span').withText('ENREGISTRER'));
});

test('Validation profil', async t => {
    await t
        .resizeWindow( 1280, 1024 )
        .navigateTo('/users/profile')
        .expect(Selector('#user-profile-level-name').textContent).eql("Administrateur")
        .expect(Selector('#user-profile-first-name').textContent).eql("Test")
        .expect(Selector('#user-profile-last-name').textContent).eql("Automatisé")
        .expect(Selector('#user-profile-email').textContent).eql("testauto@globetechnologie.com");
});

test('Photo profil', async t => {
    var today = new Date();  
    var dd = today.getDate();  
    var mm = ("0" + (today.getMonth() + 1)).slice(-2); //January is 0! 
    var yyyy = today.getFullYear();  
    await t
        .resizeWindow( 1280, 1024 )
        .navigateTo('/users/profile')
        .takeScreenshot('auth/profil.png')
        .click('#uers-profile-change-profile-picture-button')
        .setFilesToUpload('#contained-button-file', ['artifacts/screenshots/auth/profil.png'])
        .click(Selector('#user-profile-crop-image-modal-button span').withText('RECADRER'))
        .expect(Selector('#fuse-layout [alt="Test Automatisé"]').getAttribute('alt')).eql("Test Automatisé")
        .expect(Selector('#fuse-layout [alt="Test Automatisé"]').getAttribute('src')).contains("/public/uploads/images/users/"+yyyy+mm+dd)
        .expect(Selector('#fuse-layout div').withText('check_circle').nth(3).textContent).eql("check_circleVotre photo est mise à jour.");
});
