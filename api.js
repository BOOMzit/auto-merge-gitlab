import { config } from './config'
import axios from "axios";

const { gitlab_url, private_token, project_id } = config
const http = axios.create(
    {
        baseURL: gitlab_url,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'PRIVATE-TOKEN': private_token
        },
    }
);

//api from https://docs.gitlab.com/ee/api/api_resources.html

export const getBranches = async () => {
    const url = `/api/v4/projects/${project_id}/repository/branches`;
    const data = await http.get(url).then(res => res.data)
    return data;
}


export const mergeBranch = (source, target) => {
    const url = `/api/v4/projects/${project_id}/merge_requests`;
    const reqParam = {
        id: project_id,
        source_branch: source,
        target_branch: target,
        title: `Merge ${source} into ${target}`
    }

    const data = http.post(url, reqParam).then(res => res.data)
    return data;
}

export const tag = (main, tagMess = '') => {
    const url = `/api/v4/projects/${project_id}/repository/tags`;
    const reqParam = {
        id: project_id,
        tag_name: `${tagMess}_${new Date().toLocaleDateString()}`,
        ref: main,//branch name or commit id
        message: tagMess
    }

    const data = http.post(url, reqParam).then(res => res.data)
    return data;
}

export const deleteBranch = (branch) => {
    const url = `/api/v4/projects/${project_id}/repository/branches/${branch}`;
    const data = http.delete(url).then(res => res.data)
    return data;
}

export const mergeRequest = (mergeId) => {
    const url = `/api/v4/projects/${project_id}/merge_requests/${mergeId}/merge`;
    const data = http.put(url).then(res => res.data)
    return data;
}