import FuseUtils from "@fuse/FuseUtils";

function adminMenuHelper() {
  const data = [];
  const row_data = [
    {
      id: "origin-modules",
      title: "Modules Origin",
      elements: [
        {
          id: "admin-origin-modules-users-manager",
          title: "Tableau de bord",
          auth: "platform-admin",
          icon: "dashboard",
          url: "",
        },
        {
          id: "admin-origin-modules-sinister-expert",
          title: "Expert Sinistre",
          auth: "platform-admin",
          icon: "donut_large",
          url: "", //sinister-expert
        },
        {
          id: "admin-origin-modules-kpis",
          title: "Indicateurs de performance",
          auth: "kpis",
          icon: "multiline_chart",
          url: "",
        },
        {
          id: "admin-origin-modules-client-group",
          title: "Groupe de clients",
          auth: "clients_group",
          icon: "group",
          url: "/app/clients/groups/",
        },
        {
          id: "admin-origin-modules-folders",
          title: "Gestion des dossiers",
          auth: "folders",
          icon: "supervised_user_circle",
          url: "/app/folders/list",
        },
        {
          id: "admin-origin-modules-holidays",
          title: "Jours fériés",
          auth: "holidays",
          icon: "description",
          url: "/app/holidays/list",
        },
      ],
    },
    {
      id: "third-party-modules-modules",
      title: "Modules tiers",
      elements: [
        {
          id: "admin-third-party-modules-cloud",
          title: "Cloud",
          auth: "platform-admin",
          icon: "description",
          url: "/admin/third-party/seafiles",
        },
        {
          id: "admin-third-party-modules-news-block",
          title: "Bloc de nouvelles",
          auth: "content",
          icon: "bookmarks",
          url: "/news-block/admin",
        },
        {
          id: "admin-third-party-modules-activity-logs",
          title: "Journal d'activité",
          auth: "activity-log",
          icon: "bookmarks",
          url: "/app/activity_log",
        },
      ],
    },
    {
      id: "users-access",
      title: "Utilisateurs et accès",
      elements: [
        {
          id: "admin-users-access-users-manager",
          title: "Gestion des utilisateurs",
          auth: "users",
          icon: "supervised_user_circle",
          url: "/app/activity_log",
        },
        {
          id: "admin-users-access-accesses",
          title: "Gestion des droits utilisateurs",
          auth: "permissions",
          icon: "supervised_user_circle",
          url: "/admin/user-management/accesses/",
        },
      ],
    },
    {
      id: "general-settings",
      title: "Paramètres généraux",
      elements: [
        {
          id: "admin-general-settings-dynamic-menu",
          title: "Menu latéral principal",
          auth: "platform-admin",
          icon: "",
          url: "/admin/misc/dynamic-menu",
        },
        {
          id: "admin-general-settings-notifications",
          title: "Paramètres des notifications",
          auth: "platform-admin",
          icon: "",
          url: "",
        },
        {
          id: "admin-general-settings-options",
          title: "Configuration",
          auth: "config",
          icon: "settings",
          url: "/admin/misc/options",
        },
      ],
    },
  ];

  // Verify for the Permission
  for (let category of row_data) {
    if (category.elements && category.elements.length > 0) {
      let tmp = [];
      for (let item of category.elements) {
        if (FuseUtils.hasPermission(item.auth)) {
          tmp.push(item);
        } else {
          // tmp.push({...item, url: ''});
        }
      }
      if (tmp.length > 0) {
        category.elements = tmp;
        data.push(category);
      }
    }
  }

  return data;
}

export default adminMenuHelper;
