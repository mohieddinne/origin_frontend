import jwtDecode from "jwt-decode";
import FuseUtils from "@fuse/FuseUtils";
import apolloService from "../apolloService";
import { gql } from "@apollo/client";

class jwtService extends FuseUtils.EventEmitter {
  init() {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    // Get Token
    let access_token = this.getAccessToken();

    // If there is no access token emit()
    if (!access_token) {
      this.emit("onNoAccessToken");
      return;
    }

    // Verify the token
    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit(
        "onAutoLogout",
        "Session expirée, merci de se reconnecter"
      );
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  updateUserData = (user) => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  };

  logout = () => this.setSession(null);

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("jwt_access_token", access_token);
    } else {
      localStorage.removeItem("jwt_access_token");
    }
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }

    let response = false;

    try {
      const decoded = jwtDecode(access_token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp >= currentTime) {
        response = true;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }

    return response;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("jwt_access_token");
  };

  getAuthHeaders = () => {
    const token = this.getAccessToken();
    if (!token) return null;
    return {
      authorization: "Bearer " + this.getAccessToken(),
    };
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          mutation: gql`
            mutation token {
              token {
                token
                user {
                  id_Emp
                  courriel
                  nomFamille
                  prenom
                  NomEmploye
                  sexe
                  fonction
                  picture
                  Expert
                  usesAdvancedFilters
                  role {
                    id
                    name
                  }
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
              }
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          if (response.data.token) {
            this.setSession(response.data.token.token);
            resolve(response.data.token.user);
          } else {
            this.logout();
            reject(response.data.error);
          }
        })
        .catch((error) => {
          console.error(error);
          let e = "";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            switch (error.graphQLErrors[0].extensions.code) {
              case "USER_DEACTIVATED":
                e = error.graphQLErrors[0].message;
                break;
              default:
                e = error.graphQLErrors[0].message;
            }
          } else {
            e = "Server error.";
          }
          reject(e);
        });
    });
  };
  getAccessData = () => {
    return new Promise((resolve, reject) => {
      apolloService
        .query({
          query: gql`
            query {
              roles {
                id
                name
                accesses {
                  id
                  aid
                  name
                  slug
                  value
                  can_view
                  can_view_own
                  can_edit
                  can_create
                  can_delete
                }
              }
              accesses {
                id
                name
                slug
              }
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          let r = {
            email: null,
          };
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            r.email = error.graphQLErrors[0].message;
          } else {
            r.email = "Server error.";
          }

          reject(r);
        });
    });
  };
  updateAccess = (levelId, accessId, slug) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            levelId: levelId,
            accessId: accessId,
            privilege: slug,
          },
          mutation: gql`
            mutation ChangeAccess(
              $levelId: Int!
              $accessId: Int!
              $privilege: String!
            ) {
              changeAccess(
                levelId: $levelId
                accessId: $accessId
                privilege: $privilege
              )
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          let e = "Server error.";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            e = error.graphQLErrors[0].message;
          }
          reject(e);
        });
    });
  };
  /**
   * Get the options data
   * Calls the Apollo Server of Origin Backend
   */
  getConfigData = () => {
    return new Promise((resolve, reject) => {
      // Setting dynamicly the context
      // Note: this is important to access public option when user is not login in
      let context = {};
      const token = this.getAccessToken();
      if (token != null) {
        context = {
          headers: {
            authorization: "Bearer " + (this.getAccessToken() || ""),
          },
        };
      }
      // Let's get the data
      apolloService
        .query({
          query: gql`
            query {
              options {
                name
                value
              }
            }
          `,
          context: context,
          fetchPolicy: "no-cache",
        })
        .then((response) => {
          let temp = {};
          // Render an object with option slugs
          response.data.options.forEach((element) => {
            temp[element.name] = element.value;
          });
          resolve(temp);
        })
        .catch((error) => {
          console.error(error);
          let e = "Server error.";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            e = error.graphQLErrors[0].message;
          }
          reject(e);
        });
    });
  };
  /**
   * Update the options data
   * Calls the Apollo Server of Origin Backend
   */
  updateConfigData = (data) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            options: data,
          },
          mutation: gql`
            mutation UpdateOptions($options: [OptionInput]!) {
              updateOptions(options: $options)
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          let e = "Server error.";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            e = error.graphQLErrors[0].message;
          }
          reject(e);
        });
    });
  };
  /**
   * Update the background photo option data
   * This function uploads and updates the option
   * Calls the Apollo Server of Origin Backend
   */
  updateConfigHomeBackgroundImageData = (file) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            file,
          },
          mutation: gql`
            mutation ($file: Upload!) {
              updateHomeBackgroundImageOption(file: $file)
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(response.data.updateHomeBackgroundImageOption);
        })
        .catch((error) => {
          console.error(error);
          let e = "Server error.";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            e = error.graphQLErrors[0].message;
          }
          reject(e);
        });
    });
  };
  /**
   * Edit and update profile picture of the user
   * Calls the Apollo Server of Origin Backend
   */
  updateProfilePicture = (file) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            file,
          },
          mutation: gql`
            mutation setProfilePicture($file: Upload!) {
              setProfilePicture(file: $file)
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(response.data.setProfilePicture);
        })
        .catch((error) => {
          console.error(error);
          let e = "Server error.";
          // Handel backend errors
          if (error.graphQLErrors[0]) {
            e = error.graphQLErrors[0].message;
          }
          reject(e);
        });
    });
  };
  /**
   * Upload misc files
   */
  uploadImage = (file, attachedTo) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            file,
            attachedTo,
            // attachtedId,
          },
          mutation: gql`
            mutation uploadImage(
              $file: Upload!
              $attachedTo: String! # $attachtedId: Int!
            ) {
              uploadImage(
                file: $file
                attachedTo: $attachedTo
                # attachtedId: $attachtedId
              )
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(response.data.uploadImage);
        })
        .catch((error) => {
          const r = [];
          if (error.graphQLErrors)
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
}

const instance = new jwtService();

export default instance;
