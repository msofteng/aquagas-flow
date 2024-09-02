export interface IFreeImage {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
    size?: number;
}

export interface IFreeImageDetail {
    name: string;
    extension: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    likes: string;
    description?: string;
    original_filename: string;
    is_animated: string;
    nsfw: string;
    id_encoded: string;
    size_formatted: string;
    filename: string;
    url: string; // usar esse
    url_short: string;
    url_seo: string;
    url_viewer: string;
    url_viewer_preview: string;
    url_viewer_thumb: string;
    image: IFreeImage;
    thumb: IFreeImage;
    medium: IFreeImage;
    display_url: string;
    display_width: string;
    display_height: string;
    views_label: string;
    likes_label: string;
    how_long_ago: string;
    date_fixed_peer: string;
    title: string;
    title_truncated: string;
    title_truncated_html: string;
    is_use_loader: boolean;
}

export interface IStatusFreeImage {
    message: string;
    code: number;
}

export interface IFreeImageResponse {
    status_code: number;
    error?: IStatusFreeImage;
    success?: IStatusFreeImage;
    image?: IFreeImageDetail;
    status_txt: string;
}