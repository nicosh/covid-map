import usdata from '../../data/geo/us'

export default function handler(req, res) {
    res.json(usdata)
}