import {
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Sparkles,
  Video,
} from "lucide-react";

export const TEMPLATE_TYPES = {
  all: {
    id: "all",
    label: "All",
    icon: Sparkles,
    tile: { bg: "bg-brand-50", text: "text-brand-emerald" },
    title: "Create a New Template",
    description: "Choose a type below or start from scratch",
  },
  text: {
    id: "text",
    label: "Text",
    icon: MessageSquare,
    tile: { bg: "bg-info-bg", text: "text-info" },
    title: "Create a Text Template",
    description:
      "Plain text messages with formatting, variables, and quick replies",
  },
  image: {
    id: "image",
    label: "Image",
    icon: ImageIcon,
    tile: { bg: "bg-success-bg", text: "text-success" },
    title: "Create an Image Template",
    description: "Send a single image with optional caption and CTA buttons",
  },
  video: {
    id: "video",
    label: "Video",
    icon: Video,
    tile: { bg: "bg-warning-bg", text: "text-warning" },
    title: "Create a Video Template",
    description: "Send video content with caption and call-to-action buttons",
  },
  document: {
    id: "document",
    label: "Document",
    icon: FileText,
    tile: { bg: "bg-channel-linkedinBg", text: "text-channel-linkedinText" },
    title: "Create a Document Template",
    description: "Send PDFs, spreadsheets, or other documents with a header",
  },
  location: {
    id: "location",
    label: "Location",
    icon: MapPin,
    tile: { bg: "bg-danger-bg", text: "text-danger" },
    title: "Create a Location Template",
    description: "Share a pinned location with a name and address",
  },
};

export const TYPE_ORDER = ["all", "text", "image", "video", "document", "location"];
