const LoginData = `
  user {
    id_Emp
    courriel
    nomFamille
    prenom
    NomEmploye
    sexe
    fonction
    picture
    usesAdvancedFilters
    role {
      id
      name
    }
    Expert
    accesses {
      id
      slug
      name
      can_view
      can_view_own
      can_edit
      can_create
      can_delete
    }
  }
`;

export default LoginData;
