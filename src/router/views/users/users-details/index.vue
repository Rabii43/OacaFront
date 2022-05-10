<template>
  <Layout>
    <PageHeader :title="title" :items="items"/>
    <div class="card" v-if="usersData">
      <div class="card-body px-4 py-1">
        <div class="row">
          <div class="col-sm-1">
            <div v-if="!usersData.image" class="avatar-sm">
              <span class="avatar-title rounded-circle">{{ userFirstChar(usersData) }}</span>
            </div>
            <div class="avatar-sm mt-2" v-if="usersData.image">
              <img
                  :src="pathImage(usersData.image)"
                  alt="user image"
                  width="70px"
                  height="60px"
                  class="rounded-circle header-profile-user"
              />
            </div>
          </div>
          <div class="col-sm-5">
            <b-button
                variant="light"
                v-if="toEditProfile"
                class="mt-2 btn-block"
                @click="chooseImage"
            >
              <i class="bx bx-camera font-size-16 align-middle me-2"></i>
              Modifier l'image
            </b-button>
            <input
                @change="selectedFile($event)"
                class="form-control file-input"
                type="file"
                ref="fileInput"
                id="formFile"
            />
            <h5 class="card-title mt-4" v-if="!toEditProfile && !Loading">
              {{ (usersData.first_name) ? usersData.first_name.toUpperCase() : "" }}
              {{ (usersData.last_name) ? usersData.last_name.toUpperCase() : "" }}
            </h5>
            <b-spinner v-else-if="Loading" variant="success" class="mt-3" small></b-spinner>
          </div>
          <div class="col-sm-6">
            <div class="py-2 text-end">
              <b-button
                  variant="light"
                  class="btn-block mx-2"
                  @click="showModal = true"
              >
                Modifier le mot de passe
              </b-button>
              <a
                  href="#"
                  class="btn btn-md ml-2"
                  :class="toEditProfile ? 'btn-outline-secondary' : 'btn-primary'"
                  @click="toEditProfile = !toEditProfile"
              >
                <i v-if="toEditProfile" class="fas fa-arrow-left"></i>
                {{ toEditProfile ? "Retour" : "Modifier" }}
                <i v-if="!toEditProfile" class="fas fa-pen"></i>
              </a>
            </div>
            <b-modal title="Mot de passe" v-model="showModal" hide-footer>
              <b-form class="p-2" @submit.prevent="tryToUpdatePassword">
                <b-form-group
                    class="mb-3"
                    id="password-group"
                    label="Ancien mot de passe"
                    label-for="password"
                >
                  <b-form-input
                      id="password"
                      v-model="updatePass.oldPassword"
                      type="password"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                    class="mb-3"
                    id="password-group"
                    label="Nouveau mot de passe"
                    label-for="new"
                >
                  <b-form-input
                      id="new"
                      v-model="updatePass.newPassword"
                      type="password"
                  ></b-form-input>
                </b-form-group>
                <div class="mt-4 mb-4 d-flex justify-content-end">
                  <div class="p-2">
                    <b-button
                        type="submit"
                        variant="magenta"
                        class="btn-block py-2 px-4 ml-4"
                    >valider
                    </b-button>
                  </div>
                </div>
              </b-form>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
    <b-alert
        v-model="updatePassSuccess"
        class="mt-3"
        variant="success"
        dismissible
    >Mot de passe mis à jour avec succès
    </b-alert>
    <b-alert
        v-model="updatePassError"
        class="mt-3"
        variant="danger"
        dismissible
    >Le mot de passe actuel est incorrect! essayer à nouveau
    </b-alert>
    <b-alert
        v-model="registerSuccess"
        class="mt-3"
        variant="success"
        dismissible
    >Votre profil a été mis à jour avec succès
    </b-alert>
    <div v-if="!toEditProfile" class="card">
      <div class="card-body">
        <div class="table-responsive px-2">
          <table class="table table-nowrap">
            <h5 class="card-title py-2">Infromation générale:</h5>
            <tbody>
            <tr>
              <th scope="row">Nom et prénom:</th>
              <td v-if="usersData.first_name || usersData.last_name">{{ usersData.first_name }}
                {{ usersData.last_name }}
              </td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">E-mail :</th>
              <td v-if="usersData.email">{{ usersData.email }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">Banque :</th>
              <td v-if="usersData.bank">{{ usersData.bank }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">Adresse de l'agence :</th>
              <td v-if="usersData.address">{{ usersData.address }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">Fonction :</th>
              <td v-if="usersData.profession">{{ usersData.profession }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">Mobile :</th>
              <td v-if="usersData.phone">{{ usersData.phone }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            <tr>
              <th scope="row">Raison de la demande :</th>
              <td v-if=" usersData.reason">{{ usersData.reason }}</td>
              <td v-else-if="Loading">
                <b-spinner variant="success" small></b-spinner>
              </td>
              <td v-else class="text-muted-color">Aucune données</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="toEditProfile" class="card overflow-hidden">
      <div class="card-body pt-0">
        <b-alert
            v-model="isRegisterError"
            class="mt-3"
            variant="danger"
        >{{ regError }}
        </b-alert>
        <b-form class="p-2">
          <b-form-group class="mb-3" id="firstname" label="Nom" label-for="nom">
            <b-form-input
                id="firstname"
                v-model="user.firstName"
                type="text"
                placeholder="Entrer votre nom"
                :class="{
                'is-invalid': submitted && $v.user.firstName.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.firstName.required"
                class="invalid-feedback"
            >
              Nom est requis.
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="lastname"
              label="Prénom"
              label-for="prenom"
          >
            <b-form-input
                id="lastname"
                v-model="user.lastName"
                type="text"
                placeholder="Entrer votre prénom"
                :class="{
                'is-invalid': submitted && $v.user.lastName.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.lastName.required"
                class="invalid-feedback"
            >
              Prénom est requis.
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="fullname-group"
              label="Email"
              label-for="email"
          >
            <b-form-input
                id="email"
                v-model="user.email"
                type="email"
                placeholder="Entrer votre email"
                :class="{ 'is-invalid': submitted && $v.user.email.$error }"
            ></b-form-input>
            <div
                v-if="submitted && $v.user.email.$error"
                class="invalid-feedback"
            >
              <span v-if="!$v.user.email.required">Email est requis.</span>
              <span v-if="!$v.user.email.email">Veuillez entrer une adresse email valide.</span>
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="bank-group"
              label="Banque"
              label-for="Bank"
          >
            <b-form-input
                id="bank"
                v-model="user.bank"
                type="text"
                placeholder="Entrer votre banque"
                :class="{
                'is-invalid': submitted && $v.user.bank.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.bank.required"
                class="invalid-feedback"
            >
              Bank est requis.
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="address-group"
              label="Adresse de l'agence"
              label-for="address"
          >
            <b-form-input
                id="address"
                v-model="user.address"
                type="text"
                placeholder="Entrer votre adresse de l'agence"
                :class="{
                'is-invalid': submitted && $v.user.address.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.address.required"
                class="invalid-feedback"
            >
              Adresse de l'agence est requis.
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="profession-group"
              label="Fonction "
              label-for="reason"
          >
            <b-form-input
                id="reason"
                v-model="user.profession"
                type="text"
                placeholder="Entrer votre fonction "
                :class="{
                'is-invalid': submitted && $v.user.profession.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.profession.required"
                class="invalid-feedback"
            >
              Fonction est requis.
            </div>
          </b-form-group>
          <b-form-group
              class="mb-3"
              id="reason-group"
              label="Raison de la demande"
              label-for="reason"
          >
            <b-form-input
                id="reason"
                v-model="user.reason"
                type="text"
                placeholder="Entrer votre raison de la demande"
                :class="{
                'is-invalid': submitted && $v.user.reason.$error,
              }"
            ></b-form-input>
            <div
                v-if="submitted && !$v.user.reason.required"
                class="invalid-feedback"
            >
              Raison de la demande est requis.
            </div>
          </b-form-group>
          <div class="mt-4 mb-4 text-end">
            <b-button type="submit" variant="magenta" class="btn-md" @click="tryToModify($event)"
            >Enregistrer
            </b-button>
          </div>
        </b-form>
      </div>
    </div>
  </Layout>
</template>
<script>
import Layout from "../../../layouts/main";
import appConfig from "@/app.config.json";
import PageHeader from "@/components/page-header";
import {email, required} from "vuelidate/lib/validators";
import {updatePassword, usersDetails} from "../../../../../api/entryPoint";
import axios from "axios";

/**
 * Users Details Component
 */
export default {
  page: {
    title: "Mon profil",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Mon profil",
      items: [],
      baseURL: process.env.API_URL,
      toEditProfile: false,
      user: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        bank: "",
        address: "",
        reason: "",
        profession: "",
      },
      updatePass: {
        oldPassword: "",
        newPassword: "",
      },
      submitted: false,
      regError: null,
      isRegisterError: false,
      registerSuccess: false,
      showModal: false,
      updatePassSuccess: false,
      updatePassError: false,
      file: null,
    };
  },
  validations: {
    user: {
      firstName: {
        required,
      },
      lastName: {
        required,
      },
      bank: {
        required,
      },
      address: {
        required,
      },
      email: {
        required,
        email,
      },

      phone: {
        required,
      },
      reason: {
        required,
      },
      profession: {
        required,
      },
    },
  },
  created() {
    // Call users details method
    this.getUsersDetails();
  },
  methods: {
    // Get Users Details Nav
    getUsersDetailsNav() {
      this.$store.dispatch("users/usersDetailsNav", localStorage.getItem('userId'));
    },
    // Get Users Details
    getUsersDetails() {
      this.$store.dispatch("users/usersDetails", this.$route.params.id);
    },
    // Set an absolute path for image
    pathImage(name) {
      return this.baseURL + "/uploads/images/" + name;
    },
    // Update User
    tryToModify(event) {
      event.preventDefault();
      this.submitted = true;
      this.$v.$touch();
      // if (!this.$v.$invalid && this.ValidatePhoneNumber(this.user.phone)) {
      //   let data;
      //   // If we have an image to upload we use a formData else we use json
      //   data = new FormData();
      //   for (let key in this.user) {
      //     data.append(key, this.user[key]);
      //   }
      //   data.append("image", this.file);
      //   // Send user data
      //   axios.post(usersDetails + this.$route.params.id, data
      //   ).then((res) => {
      //     if (res.data.code === 200) {
      //       this.registerSuccess = true;
      //       // refresh user details
      //       this.getUsersDetails();
      //       this.getUsersDetailsNav();
      //       this.toEditProfile = false;
      //     } else {
      //       this.isRegisterError = true;
      //       this.regError = "échec de la modification de l'utilisateur";
      //     }
      //   }).catch((error) => {
      //     this.isRegisterError = true;
      //     this.regError = "échec de la modification de l'utilisateur";
      //   });
      // } else {
      //   return;
      // }
    },
    // fill inputs with user data
    matchUserData(res) {
      this.user.firstName = res.name;
      this.user.lastName = res.name;
      this.user.email = res.email;
      this.user.phone = res.phone;
      this.user.address = res.address;
    },
    // Update user Password
    tryToUpdatePassword() {
      axios.post(updatePassword + this.$route.params.id,
          this.updatePass
      ).then((res) => {
        if (res.status === 200) {
          this.updatePassSuccess = true;
        }
      }).catch((error) => {
        this.updatePassError = true;
      });
      this.showModal = false;
      this.updatePass = {};
    },
    // choose Image Profile
    chooseImage() {
      this.$refs.fileInput.click();
    },
    // Select file
    selectedFile(e) {
      this.file = e.target.files[0];
    },
    // First char from username
    userFirstChar(data) {
      return data.name ? data.name.charAt(0).toUpperCase() : "";
    },
  },
  computed: {
    // get user data from store
    usersData() {
      let res = this.$store.getters["users/getUsersDetails"];
      if (res) {
        this.matchUserData(res);
      }
      return res;
    },
    Loading() {
      return this.$store.getters["users/getIsLoading"];
    },
  },
};
</script>


<style scoped>
th {
  width: 30% !important;
}

.file-input {
  display: none;
}
</style>