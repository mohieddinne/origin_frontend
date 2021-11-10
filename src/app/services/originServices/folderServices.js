import { gql } from "@apollo/client";
import apolloService from "../apolloService";
import { jwtService } from "app/services/originServices";

export function list(ids = [], search = "", filtersObj = {}) {
  const filters = Object.keys(filtersObj).map((key) => {
    const a = filtersObj[key];
    const value = Array.isArray(a) ? a : [a];
    return {
      name: key,
      value,
    };
  });
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
          search,
          filters,
        },
        query: gql`
          query folders(
            $ids: [ID]
            $search: String
            $filters: [ArrayFilterInput]
          ) {
            folders(ids: $ids, search: $search, filters: $filters) {
              NumeroDossier
              Reference
              Bureau
              Responsable
              RecuPar
              DateMandat
              TypeDePerte
              TypeBatiment
              VillePerte
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve({ data: data.folders || [] });
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}

export function filters(slugs = []) {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          slugs,
        },
        query: gql`
          query filters($slugs: [String]) {
            filters(slugs: $slugs) {
              name
              data {
                name
                value
                favorite
                actif
              }
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.filters);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}

export function get(ids = [], search = "", filters = []) {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
          search,
          filters,
        },
        query: gql`
          query folders(
            $ids: [ID]
            $search: String
            $filters: [ArrayFilterInput]
          ) {
            folders(ids: $ids, search: $search, filters: $filters) {
              NumeroDossier
              RecuPar
              Responsable
              DateRDV
              Bureau
              Repertoire
              TelephonerPourRDV
              Budget
              TempsEstime
              MontantPerte
              TypeDePerte
              HeurePerte
              NomAssure
              Reference
              DatePerte
              AdresseAssure
              VilleAssure
              CodePostalAssure
              TypeAssure
              TypeBatiment
              PersonneContactAssure
              CourrielContactAssure
              TelBureauContactAssure
              TelFaxContactAssure
              TelCellulaireContactAssure
              TelDomicileContactAssure
              TelAutreContactAssure
              CommentaireContactAssure
              AdressePerte
              VillePerte
              CodePostalPerte
              DescriptionMandat
              AutresDirectives
              DateFerme
              MarqueVE
              ModeleVE
              AnneeVE
              NIVVE
              LieuEntreposageVE
              PersonneContactVE
              TelPersonneContactVE
              NoStockVE
              AdresseVE
              VilleVE
              CodePostalVE
              NotesVE
              LieuEntreposage
              FraisEntreposage
              FraisDestruction
              DimensionTotaleSpecimenH
              DimensionTotaleSpecimenL
              DimensionTotaleSpecimenP
              FraisChargePar
              FraisDestructionChargePar
              CauseSinistre
              EquipementEnCause
              Manufacturier
              Modele
              ResultatProces
              NoteProces
              NumeroJugement
              DateProchaineActivite
              Responsable_Ajd_ID_Emp
              Forfait
              DateMandat
              HeureMandat
              DateLivraison
              Commentaire
              NomContact
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        const options = {};
        (data.options || []).map(({ name, value }) => {
          try {
            options[name] = JSON.parse(value);
          } catch {
            options[name] = value;
          }
          return options[name];
        });
        resolve({ ...data, options });
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}

export function remove(NumeroDossier) {
  return new Promise((resolve, reject) => {
    apolloService
      .mutate({
        variables: {
          data: {
            NumeroDossier,
          },
        },
        mutation: gql`
          mutation folder($data: FolderInput!) {
            folder(data: $data, operation: "delete") {
              NumeroDossier
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.folder);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}

// Create or update an item
export function mutate(data) {
  return new Promise((resolve, reject) => {
    apolloService
      .mutate({
        variables: {
          data,
        },
        mutation: gql`
          mutation($data: FolderInput!) {
            folder(data: $data) {
              Bureau
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.folder);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}

export const Offices = (ids = []) => {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
        },
        query: gql`
          query offices($ids: [ID]) {
            offices(ids: $ids)
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then((response) => {
        resolve(response.data.offices);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};
