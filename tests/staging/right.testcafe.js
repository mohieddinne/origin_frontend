import { Selector } from 'testcafe';

fixture `right`
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

test('Right Check', async t => {
    await t
        .resizeWindow(1280, 1024)
    .navigateTo("/admin/misc/dynamic-menu")
    .expect(
      Selector("#fuse-navbar .list-item-text span").withText(
        "Bloc de nouvelles"
      ).exists
    )
    .eql(true)
    .click(Selector("#fuse-layout span").withText("edit").nth(2))
    .click(
      Selector("#dynamic-menu-form span").withText(
        "Administrateur"
      )
    )
    .click(Selector("#submit span").withText("ENREGISTRER L'ÉLÉMENT"))
    .click(
      Selector("#fuse-layout span").withText("ENTREGISTER LE MENU")
    )
    .click(Selector("span").withText("CONFIRMER"))
    .expect(
      Selector("#fuse-navbar .list-item-text span").withText(
        "Bloc de nouvelles"
      ).exists
    )
    .eql(false)
    .click(
      Selector("#dynamic-menu-form span").withText(
        "Administrateur"
      )
    )
    .click(Selector("#submit span").withText("ENREGISTRER L'ÉLÉMENT"))
    .click(
      Selector("#fuse-layout span").withText("ENTREGISTER LE MENU")
    )
    .click(Selector("span").withText("CONFIRMER"))
    .expect(
      Selector("#fuse-navbar .list-item-text span").withText(
        "Bloc de nouvelles"
      ).exists
    )
    .eql(true);
});
