import { reactive, ref } from "vue";
import {
  ProvinceIF,
  CityIF,
  CompanyBranchIF,
  CompanyLevelIF,
} from "../../interface/area.interface";
import { defineStore } from "pinia";
import { CompanyIF } from "../company/company.interface";
import { CompanyOrganizationIF } from "../company-structure/company-organization/company-organization.interface";
import { CompanyTitleIF } from "../company-structure/company-title/company-title.interface";
import { useQuery } from "../../composables/use-helper";
import { mainStore } from "../../store";
import useApi from "../../composables/use-api";

const api = new useApi();

const store = mainStore();

export const usePhotoStore = defineStore("photo", () => {
  const photoPreview = ref<string | null>(null);
  const resetPhotoPreview = () => {
    photoPreview.value = null;
  };
  return { photoPreview, resetPhotoPreview };
});

export interface DataProvinceIF {
  list: Array<ProvinceIF> | [];
  loading: boolean;
  selected: ProvinceIF | null;
  find: string;
  q: any;
}

export interface DataCityIF {
  list: Array<CityIF> | [];
  loading: boolean;
  selected: CityIF | null;
  find: string;
  q: any;
}

export interface DataCompanyIF {
  list: Array<CompanyIF> | [];
  loading: boolean;
  selected: CompanyIF | null;
  find: string;
  q: any;
}

export interface DataCompanyBranchIF {
  list: Array<CompanyBranchIF> | [];
  loading: boolean;
  selected: CompanyBranchIF | null;
  find: string;
  q: any;
}

export interface DataCompanyOrganizationIF {
  list: Array<CompanyOrganizationIF> | [];
  loading: boolean;
  selected: CompanyOrganizationIF | null;
  find: string;
  q: any;
}

export interface DataCompanyLevelIF {
  list: Array<CompanyLevelIF> | [];
  loading: boolean;
  selected: CompanyLevelIF | null;
  find: string;
  q: any;
}

export interface DataCompanyTitleIF {
  list: Array<CompanyTitleIF> | [];
  loading: boolean;
  selected: CompanyTitleIF | null;
  find: string;
  q: any;
}

export const identity_province = reactive<DataProvinceIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});

export const current_province = reactive<DataProvinceIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});

export const identity_city = reactive<DataCityIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});
export const current_city = reactive<DataCityIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});

export const company = reactive<DataCompanyIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});

export const company_branch = reactive<DataCompanyBranchIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    company_id: null,
    name: "",
  },
});

export const company_organization = reactive<DataCompanyOrganizationIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    company_id: null,
    name: "",
  },
});

export const company_level = reactive<DataCompanyLevelIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    company_id: null,
    name: "",
  },
});

export const company_title = reactive<DataCompanyTitleIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    company_id: null,
    name: "",
  },
});

export const getProvince = (type: "identity" | "current"): void => {
  const provinceData =
    type === "identity" ? identity_province : current_province;
  provinceData.loading = true;
  const q = useQuery(provinceData.q);

  api
    .get(`province${q}`)
    .then((res) => {
      let raw: Array<ProvinceIF> = res.data.items;

      if (provinceData.q.Page > 1) {
        provinceData.list = [...provinceData.list, ...raw];
      } else {
        provinceData.list = raw;
      }
    })
    .finally(() => {
      provinceData.loading = false;
    });
};

export const getCity = (type: "identity" | "current") => {
  const cityData = type === "identity" ? identity_city : current_city;
  if (!cityData.q.province_id) return;
  cityData.loading = true;
  api
    .get(`city${useQuery(cityData.q)}`)
    .then((res) => {
      cityData.list = res.data.items;
    })
    .finally(() => {
      cityData.loading = false;
    });
};

export const getCompanyBranch = (): void => {
  company_branch.loading = true;
  company_branch.q.company_id = store.company?.id;
  const q = useQuery(company_branch.q);
  api.get(`company-branch${q}`).then((res) => {
    let raw: Array<CompanyBranchIF> = res.data.items;
    if (company_branch.q.Page > 1) {
      company_branch.list = [...company_branch.list, ...raw];
    } else {
      company_branch.list = raw;
    }
    company_branch.loading = false;
  });
};

export const getCompanyOrganization = (): void => {
  company_organization.loading = true;
  company_organization.q.company_id = store.company?.id;
  const q = useQuery(company_organization.q);
  api.get(`company-organization${q}`).then((res) => {
    let raw: Array<CompanyOrganizationIF> = res.data.items;
    if (company_organization.q.Page > 1) {
      company_organization.list = [...company_organization.list, ...raw];
    } else {
      company_organization.list = raw;
    }
    company_organization.loading = false;
  });
};

export const getCompanyLevel = (): void => {
  company_level.loading = true;
  company_level.q.company_id = store.company?.id;
  const q = useQuery(company_level.q);
  api.get(`company-level${q}`).then((res) => {
    let raw: Array<CompanyLevelIF> = res.data.items;
    if (company_level.q.Page > 1) {
      company_level.list = [...company_level.list, ...raw];
    } else {
      company_level.list = raw;
    }
    company_level.loading = false;
  });
};

export const getCompanyTitle = (): void => {
  company_title.loading = true;
  company_title.q.company_id = store.company?.id;
  const q = useQuery(company_title.q);
  api.get(`company-title${q}`).then((res) => {
    let raw: Array<CompanyTitleIF> = res.data.items;
    if (company_title.q.Page > 1) {
      company_title.list = [...company_title.list, ...raw];
    } else {
      company_title.list = raw;
    }
    company_title.loading = false;
  });
};
